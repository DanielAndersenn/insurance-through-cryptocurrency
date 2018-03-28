import React from 'react';
import Header from './Header.js';
import Footer from './Footer.js';

class HelpPage extends React.Component {

    render() {
        return (
            <div className="verticalDiv">
            <Header headerTitle='How to'/>
            <div className="container">
            </div>
            <div className="phantomDiv">
            <Footer />
            </div>
            </div>
        )
    }

}
export default HelpPage;