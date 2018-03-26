import React from 'react';
import Header from './Header.js';
import InfoForm from './InfoForm.js'
import InfoFormHeader from './InfoFormHeader.js'
import axios from 'axios';

class ItcApp extends React.Component {
    state = {
        calculatedOnce: false,
        ethPrice: 0
    }

    handleCalculate = (name, address, cpr, email, type, cost, model, pcSerial, individualParts, selfBuilt) => {

        if(this.state.calculatedOnce === false)
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

                    console.log('#### SUCCESS=??????? ####');
                    console.log(response);
                    axios.put('calculatePolicy', {
                        policySerial: policySerial
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
                }).catch((error) => {
                    console.log(error);
                });
            }

          }).catch((error) => {
          console.log(error);
          });
          

    };

    render() {
        return (
            <div>
            <Header />
            <div className="container">
            <div>
            <InfoFormHeader />
            </div>
            <InfoForm ethPrice={this.state.ethPrice} handleCalculate={this.handleCalculate}/>
            </div>
            </div>
        )
    }

};

export default ItcApp;