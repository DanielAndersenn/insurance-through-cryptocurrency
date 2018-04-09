import React from 'react';
import Header from './Header.js';
import Footer from './Footer.js';

class HelpPage extends React.Component {

    render() {
        return (
            <div className="verticalDiv">
            <Header headerTitle='How to'/>
            <div className="help-page-container">
                <ol className="howToList">
                    <li>Make sure youre using Chrome as your browser</li> 
                    <li>MetaMask is an extension that allows your browser to interact with the Ethereum blockchain. Go <a key="metaMaskLink" href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn' target="_blank" className="link">here</a> to install the metamask extension for Chrome</li>    
                    <li>A new extension icon should have appeared in the top right corner of Chrome (it's a fox)</li>
                    <li>Click on the icon and accept the terms of service</li>
                    <li>In the top left corner of MetaMask, change the network from "Main Network" to "Ropsten Test Network"</li>
                    <li>Choose a password for your metamask account in the fields below and click "Create"</li>
                    <li>Save the seed phrase of 12 words or download the as a file. Then click "I've copied these somewhere safe"</li>
                    <li>Congratulations, you just created a digital wallet for the Ethereum network. Notice your balance of 0 ETH.</li>
                    <li>To get some ETH coins to use on the site, head <a key="ethFaucet" href='https://faucet.metamask.io/' target="_blank" className="link">here</a>, and press the green button "request 1 Ether from faucet"</li>
                    <li>Click on MetaMask and wait for your balance to go up. Feel free to request more than 1 ETH</li>
                    <li>When you're satisfied with your balance head back to the frontpage and retry buying your policy.</li>
                </ol>
            </div>
            <div className="phantomDiv">
            <Footer />
            </div>
            </div>
        )
    }

}
export default HelpPage;