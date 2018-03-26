import React from 'react';

class InfoFormHeader extends React.Component {

    render() {
        return (
        <div>  
            <table className="info-form-header-table">
            <thead>
            <tr>
            <th className="info-form-header-table-text">User Info</th>
            <th className="info-form-header-table-text">System Info</th>
            </tr>
            </thead>
            </table>
        
        </div>
    )
    }

}

export default InfoFormHeader;