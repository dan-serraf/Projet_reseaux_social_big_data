import React from 'react';

export default class Logout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="text-center bloc_bas"><button type="button" className="btn btn-dark " onClick={this.props.logout}>Logout</button></div>
    }
}