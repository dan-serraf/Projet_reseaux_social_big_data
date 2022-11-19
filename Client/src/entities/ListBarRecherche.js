import React from 'react';

export default class ListBarRecherche extends React.Component {
    constructor(props) {
        super(props);
        this.state = { profil_recherche: [] }
    }

    render() {
        return <div className="ListBarRecherche">
            {this.props.profil_recherche !== undefined && this.props.profil_recherche.map((profil, index) => <div key={index} className="dropdown-item" onClick={() => this.props.setCurrentPage("profil", profil.rowid)}>{profil.login}</div>)}

        </div>;
    }
}
