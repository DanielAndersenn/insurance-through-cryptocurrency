import React from 'react';
import Header from './Header.js';
import InfoForm from './InfoForm.js';
import InfoFormHeader from './InfoFormHeader.js';
import Footer from './Footer.js';
import MessageModal from './MessageModal.js'
import axios from 'axios';

class ItcApp extends React.Component {
    state = {
        calculatedOnce: false,
        ethPrice: 0,
        policySerial: '',
        policyParams: [],
        messages: undefined
    }

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
            messages: undefined
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
          axios.post('customer', {
            name: name,
            address: address,
            cpr: cpr,
            email: email
          }).then((response) => {
            var customerSerial = response.data.serial;
          console.log(response);
            if(response.status === 200)
            {
                axios.post('policy', {
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
                    axios.put('calculatePolicy', {
                        policySerial: policySerial,
                        policyParams: policyParamArray
                    }).then((response) => {
                        console.log(response);
                        var PREMIUM_ETH = response.data.policyParameterValues.find((element) => {
                            return element.name === 'PREMIUM_ETH';
                        });

                        this.setState(() => ({
                            ethPrice: PREMIUM_ETH.value,
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
            axios.put('calculatePolicy', {
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

                this.setState(() => ({
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
            <InfoForm ethPrice={this.state.ethPrice} handleCalculate={this.handleCalculate}/>
            </div>
            <div className="phantomDiv">
            <Footer />
            </div>
            <MessageModal 
            messages={this.state.messages}
            handleMessageClear={this.handleMessageClear}
            />
            </div>
        )
    }

};

export default ItcApp;