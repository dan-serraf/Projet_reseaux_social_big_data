import React from 'react';
import Friend from './Friend';

export default class FriendList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { amis: [] }
        this.props.friends.map((ami, index) => this.addAmi(ami))
        this.enlever_ami = this.enlever_ami.bind(this);
    }
    addAmi(a) {
        return this.props.api.get("/user/" + a)
            .then((data) => {

                if (data.data !== []) {
                    let tmp = data.data
                    tmp.id = a
                    console.log([...this.state.amis, tmp])
                    this.setState({ amis: [...this.state.amis, tmp] })
                }
            })
            .catch((err) => console.log(err));
    }
    enlever_ami(a) {
        let tmp = [...this.state.amis]
        for (var ami of tmp) {
            if (ami.id === a) {
                tmp.splice(tmp.indexOf(ami), 1)
                this.setState({ amis: tmp })
            }

        }
    }
    render() {
        return <div className="FriendList">{this.state.amis.map((ami, index) =>
            <Friend key={index} login={ami.login} enlever_ami={this.enlever_ami} setCurrentPage={this.props.setCurrentPage} deleteFriend={this.props.deleteFriend} ident={ami.id} />
        )}</div>;
    }
}


// <Friend login= {data.data} setCurrentPage={this.props.setCurrentPage} deleteFriend={this.props.deleteFriend} ident={a}/>