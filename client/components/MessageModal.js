import React from 'react';
import Modal from 'react-modal';


class MessageModal extends React.Component { 
    
    render() {
        
    return (
        <Modal
            isOpen={!!this.props.messages}
            contentLabel="Selected option"
            closeTimeoutMS={200}
            className="modal"
            onRequestClose={this.props.handleMessageClear}
            >
            {console.log(this.props.messages)}
            <h3 className="modal__title">{this.props.modalTitle}</h3>
            {this.props.messages && this.props.messages.map((message, index) => {
                return <div key={index}>{message}</div>
            })}
            <button className="button-small" onClick={this.props.handleMessageClear}>Ok</button>
        </Modal>
    )
    }

}

export default MessageModal;