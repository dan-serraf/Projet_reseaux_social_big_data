import React from 'react'

export default class Friend extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.login)
    }

    render() {
        return (<div className="Friend text-center">
            <a className="a_friends" onClick={() => this.props.setCurrentPage("profil", this.props.ident)}>{this.props.login}</a>
            <button type="button" className="btn btn-dark" onClick={() => { this.props.deleteFriend(this.props.ident); this.props.enlever_ami(this.props.ident); }}>X</button>
        </div>);
    }
}

