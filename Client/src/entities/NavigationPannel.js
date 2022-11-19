import React from 'react';
import Login from './Login.js'

export default class NavigationPannel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<nav>
            {this.props.connected ?
                undefined :
                <Login login={this.props.login} setpage={this.props.setpage} />}
        </nav>
        )
    }
}
