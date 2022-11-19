import React from "react"

class FormAddMessage extends React.Component {

    send() {
        this.props.addMessage(this.refs.message.value)
    }

    render() {
        return (
            
            <div className="surFormAddMessage">
                <div className="FormAddMessage">
                    <input type="textarea" placeholder="What's happening?" className="formAddMess w-100" ref="message" />
                    <div className="p-2"><button type="button" className="btn btn-dark" onClick={(event => this.send())}>Envoyer</button></div>
                </div>
            </div>
          
        )
    }
}

export default FormAddMessage;
/// <div className="borderSurFormAddMessage">