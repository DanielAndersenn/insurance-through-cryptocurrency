import React from 'react';

const Header = (props) => (
    <div className="header">
        <div className="container">
        <h1>{props.headerTitle}</h1>
        </div>
    </div>
)

export default Header;