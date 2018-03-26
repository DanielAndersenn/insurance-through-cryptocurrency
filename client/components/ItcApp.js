import React from 'react';
import Header from './Header.js';
import InfoForm from './InfoForm.js';
import InfoFormHeader from './InfoFormHeader.js';
import Footer from './Footer.js';
import axios from 'axios';

class ItcApp extends React.Component {
    state = {
        calculatedOnce: false,
        ethPrice: 0,
        policySerial: ''
    }

    handleCalculate = (name, address, cpr, email, type, cost, model, pcSerial, individualParts, selfBuilt) => {


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

                    console.log(response);
                    axios.put('calculatePolicy', {
                        policySerial: policySerial,
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
                            ethPrice: PREMIUM_ETH.value,
                            calculatedOnce: true,
                            policySerial: policySerial
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
            console.log("Doing subsequent calculate with value: " + this.state.policySerial);
            axios.put('calculatePolicy', {
                policySerial: this.state.policySerial,
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
    };

    render() {
        return (
            <div className="verticalDiv">
            <Header />
            <div className="container">
            <div>
            <InfoFormHeader />
            </div>
            <InfoForm ethPrice={this.state.ethPrice} handleCalculate={this.handleCalculate}/>
            </div>
            <div className="phantomDiv">
            <Footer />
            </div>
            </div>
        )
    }

};

export default ItcApp;