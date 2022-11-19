import React from 'react';
import Message from './Message';

class MessagesList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className="MessagesList accordion accordion-flush" id="accordionMessage">{
            this.props.messages !== [] &&
            this.props.messages.map((Mess, index) => <Message key={index} setCurrentPage={this.props.setCurrentPage} putMsg={this.props.putMsg} ident={Mess._id} deleteMsg={this.props.deleteMsg} uid={this.props.uid} author_id={Mess.author_id} author_name={Mess.author_name} texte={Mess.text} date={Mess.date} index={index} />)
        }</div>;
    }
}

export default MessagesList