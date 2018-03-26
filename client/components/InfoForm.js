import React from 'react';

export default class InfoForm extends React.Component {

    handleCalculate = (event) => {
        event.preventDefault();

        //Grab user info values
        const name = event.target.elements.name.value;
        const address = event.target.elements.address.value;
        const cpr = event.target.elements.cpr.value;
        const email = event.target.elements.email.value;

        //Grab system info values
        const type = event.target.elements.pcType.value;
        const cost = event.target.elements.systemCost.value;
        const model = event.target.elements.model.value;
        const pcSerial = event.target.elements.pcSerial.value;
        const individualParts = event.target.elements.individualParts.value;
        const selfBuilt = event.target.elements.selfBuilt.value;

        console.log('Value of type: ' + type);
        console.log('Value of cost: ' + cost);
        console.log('Value of model: ' + model);
        console.log('Value of pcSerial: ' + pcSerial);
        console.log('Value of individualParts: ' + individualParts);
        console.log('Value of selfBuilt: ' + selfBuilt);


        this.props.handleCalculate(name, address, cpr, email, type, cost, model, pcSerial, individualParts, selfBuilt);

    };

    render() {
        return (
            <div>
            <form onSubmit={this.handleCalculate}>
            <table className="info-form-table">
            <tbody>
            <tr>
            <td className="info-table-body"><label htmlFor="name"><span>Name:</span><input className="input-field" type="text" name="name"/></label></td>
            <td className="info-table-body"><label htmlFor="address"><span>Address:</span><input className="input-field" type="text" name="address"/></label></td>
            <td className="info-table-body"><label htmlFor="pcType"><span>Type:</span><select className="select-field" name="pcType">
                <option value="Desktop">Desktop</option>
                <option value="Laptop">Laptop</option>
                </select>
                </label>
                </td>
            <td className="info-table-body"><label htmlFor="systemCost"><span>Cost:</span><input className="input-field-cost" type="text" name="systemCost"/> kr.</label></td>
            </tr>
            <tr>
            <td className="info-table-body"><label htmlFor="cpr"><span>CPR: </span><input className="input-field" type="text" name="cpr"/></label></td>
            <td className="info-table-body"><label htmlFor="email"><span>Email: </span><input className="input-field" type="text" name="email"/></label></td>
            <td className="info-table-body"><label htmlFor="model"><span>Model: </span><input className="input-field" type="text" name="model"/></label></td>
            <td className="info-table-body"><label htmlFor="pcSerial"><span>Serial: </span><input className="input-field" type="text" name="pcSerial"/></label></td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td className="coverage-header">Individual parts cover (+10%): <input className="input-field-checkbox" type="checkbox" name="individualParts"/></td>
            <td className="coverage-header">Self-built cover (+5%): <input className="input-field-checkbox" type="checkbox" name="selfBuilt"/></td>
            </tr>
            </tbody>
            </table>
            <div className="">Price: {this.props.ethPrice}</div>
            <button className="calc-button">Calculate</button>
            <button className="buy-button">Buy</button>
            </form>
            </div>

        )
    }

}