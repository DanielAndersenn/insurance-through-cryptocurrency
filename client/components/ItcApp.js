import React from 'react';
import axios from 'axios';
import Web3 from 'web3';
import promisify from 'util.promisify';
import Header from './Header.js';
import InfoForm from './InfoForm.js';
import InfoFormHeader from './InfoFormHeader.js';
import Footer from './Footer.js';
import MessageModal from './MessageModal.js';

class ItcApp extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        calculatedOnce: false,
        ethPrice: 0,
        krPrice: 0,
        policySerial: '',
        policyParams: [],
        messages: undefined,
        modalTitle: '',
        metaMask: true
    }

    componentDidMount() {
        //Init web3 for interacting with Ethereum
        //Detect source for ethereum node. This project will always load in web3 from Metamask
        if(typeof web3 != 'undefined'){
            console.log("Using web3 detected from external source Metamask");
            this.web3 = new Web3(web3.currentProvider);
            console.log('Version of web3: ' + this.web3.version.api);
        }else{
            this.setState(() => ({
                modalTitle: 'Missing MetaMask extension',
                messages: ["This website only works with the browser extension MetaMask installed. ", 
                ["Go ", <a key="howToLink" href='/help' target="_blank" className="link">here</a>, " for a guide on how to use the site."]],
                metaMask: false
            }));
        }
    };
    
    handleBuy = async () => {
        console.log('handleBuy() begin');

        const account = this.web3.eth.accounts[0];
        
        //Validate user is logged in to MetaMask account
        if(account === undefined) {
            this.setState(() => ({
                modalTitle: 'Not logged into MetaMask',
                messages: ["To buy the policy you need to login to your MetaMask account!", 
                ["Go ", <a key="howToLink" href='/help' target="_blank" className="link">here</a>, " for a guide on how to use the site."]]
            }));
        } else {

        const sendTransaction = promisify(this.web3.eth.sendTransaction);
        const danandInsureAddress = '0x9F7F968bD55Fb37cDB5209A84c18bbF48Ef3C604';
        console.log('Value of value: ' + this.web3.toWei(1, 'ether'));
        
        const address = await sendTransaction({
            from: account,
            to: danandInsureAddress,
            value: web3.toWei(this.state.ethPrice, 'ether')
        }).then((result) => {
            console.log('Transaction ID: ' + result);

            var transactionLink = 'https://ropsten.etherscan.io/tx/' + result;
            var polSerial = this.state.policySerial;

            //Initiate activeCollectPay function in IBSuite to process payment info and move policy through its lifecycle
            axios.put('api/payPolicy', {
                transactionLink: transactionLink,
                polSerial: polSerial
              }).then((response) => {
              //Handle response 
              console.log("Value of response from payPolicy: " + response);
              
              });
            //Writing response to modal
            this.setState(() => ({
                modalTitle: 'Transaction confirmation',
                messages: [["Click ", <a key="howToLink" href={transactionLink} target="_blank" className="link">here</a>, " to see your transaction."]]
            }));
        }).catch((error) => {
            console.log(error);
        });

        //end MetaMask account validation else
        }
        
        
        console.log('handleBuy() end');
    };

    //Validation handler
    handleValidation = (name, address, cpr, email, cost, model, pcSerial) => {

        var messages = [];

                //Do validation of input fields
                if(!name){
                    messages.push('Name');
                }
        
                if(!address){
                    messages.push('Address');
                }
        
                if(!cpr){
                    messages.push('Cpr');
                }
        
                if(!email){
                    messages.push('Email');
                }
        
                if(!cost){
                    messages.push('Cost');
                } else if(Number(cost) > 100000) {
                    messages.push('Cost of insured PC may not exceed 100.000 kr.')
                }
        
                if(!model){
                    messages.push('Model');
                }
        
                if(!pcSerial){
                    messages.push('PC Serial');
                }

        return messages;

    } 

    handleMessageClear = () => {
        this.setState(() => ({
            messages: undefined,
            modalTitle: ''
        }));
    }


    handleCalculate = (name, address, cpr, email, type, cost, model, pcSerial, individualParts, selfBuilt) => {

        var validationMessages = this.handleValidation(name, address, cpr, email, cost, model, pcSerial);
        
        //If validation succeeds
        if(validationMessages.length == 0)
        {
        //Handle customer and policy creation on first calc
        if(this.state.calculatedOnce === false)
        {
          
          console.log("Doing customer and policy creation then calculate");
          axios.post('api/customer', {
            name: name,
            address: address,
            cpr: cpr,
            email: email
          }).then((response) => {
            var customerSerial = response.data.serial;
          console.log(response);
            if(response.status === 200)
            {
                axios.post('api/policy', {
                    type: type,
                    cost: cost,
                    model: model,
                    pcSerial: pcSerial,
                    individualParts: individualParts,
                    selfBuilt: selfBuilt,
                    customerSerial: customerSerial
                }).then((response) => {

                    var policySerial = response.data.serial;
                    var policyParamArray = response.data.policyParameterValues;

                    console.log(response);
                    axios.put('api/calculatePolicy', {
                        policySerial: policySerial,
                        policyParams: policyParamArray
                    }).then((response) => {
                        console.log(response);
                        var PREMIUM_ETH = response.data.policyParameterValues.find((element) => {
                            return element.name === 'PREMIUM_ETH';
                        });

                        var PREMIUM_KR =  response.data.policyParameterValues.find((element) => {
                            return element.name === 'PREMIUM_KR';
                        });

                        this.setState(() => ({
                            ethPrice: PREMIUM_ETH.value,
                            krPrice: PREMIUM_KR.value,
                            calculatedOnce: true,
                            policySerial: policySerial,
                            policyParams: policyParamArray
                        }));
                        console.log('Value of this.state.ethPrice: ' + this.state.ethPrice);
                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }

          }).catch((error) => {
          console.log(error);
          });
          
        } else {
            console.log("Doing subsequent calculate on policy: " + this.state.policySerial);
            axios.put('api/calculatePolicy', {
                policySerial: this.state.policySerial,
                policyParams: this.state.policyParams,
                type: type,
                cost: cost,
                model: model,
                pcSerial: pcSerial,
                individualParts: individualParts,
                selfBuilt: selfBuilt
            }).then((response) => {
                console.log(response);
                var PREMIUM_ETH = response.data.policyParameterValues.find((element) => {
                    return element.name === 'PREMIUM_ETH';
                });

                var PREMIUM_KR =  response.data.policyParameterValues.find((element) => {
                    return element.name === 'PREMIUM_KR';
                });

                this.setState(() => ({
                    krPrice: PREMIUM_KR.value,
                    ethPrice: PREMIUM_ETH.value
                }));
                console.log('Value of this.state.ethPrice: ' + this.state.ethPrice);
            }).catch((error) => {
                console.log(error);
            });
        }

    } 
    //If validation fails
    else {
        this.setState(() => ({
            modalTitle: 'Validation of input fields failed',
            messages: validationMessages
        }));
    }

    };

    render() {
        return (
            <div className="verticalDiv">
            <Header headerTitle='Insurance through Cryptocurrency'/>
            <div className="container">
            <div>
            <InfoFormHeader />
            </div>
            <InfoForm 
                ethPrice={this.state.ethPrice}
                krPrice={this.state.krPrice}
                handleCalculate={this.handleCalculate} 
                handleBuy={this.handleBuy}
                calculatedOnce={this.state.calculatedOnce}/>
            </div>
            <div className="phantomDiv">
            <Footer />
            </div>
            <MessageModal
            modalTitle={this.state.modalTitle} 
            messages={this.state.messages}
            handleMessageClear={this.handleMessageClear}
            />
            </div>
        )
    }

};

export default ItcApp;