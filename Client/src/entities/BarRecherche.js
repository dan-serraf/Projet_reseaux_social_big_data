import React from 'react';
import ListBarRecherche from './ListBarRecherche'

export default class BarRecherche extends React.Component {

  render() {
    return <div className="container div_bar_recherche dropdown">
      <input className="bar_recherche me-2 dropdown-toggle" type="search" ref="recherche" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" onChange={() => this.props.rechercheProfils(this.refs.recherche.value)} />
      <button type="button" className="btn btn-dark" onClick={() => this.props.rechercheMessages(this.refs.recherche.value).then(() => this.props.setCurrentPage("resultats"))}>Recherche</button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

        <ListBarRecherche profil_recherche={this.props.profil_recherche} setCurrentPage={this.props.setCurrentPage} />
      </div>
    </div>
  }
}
