
import React from 'react'
import MessagesList from "./MessagesList"
import MenuGauche from './MenuGauche'
import BarRecherche from './BarRecherche'

export default class Mur extends React.Component {

  render() {
    return (

      <div className="mur p-0">
        <div className="row p-0 m-0">
          <div className="menu_verticale col-md-2 col-lg-2 p-0">
            <MenuGauche setCurrentPage={this.props.setCurrentPage} uid={this.props.uid} logout={this.props.logout}/>
          </div>
          <div className="container col-md-7 col-lg-7 p-0">
            <div className="container p-0" id="mur_headers">
              <div className="container fond_baniere" ><img src={process.env.PUBLIC_URL + "/image/image_sign_in.jpg"} width="70%" height="60%" /></div>
            </div>
            <div className="container">
              {<MessagesList putMsg={this.putMsg} messages={this.props.messages} uid={this.props.uid} deleteMsg={this.deleteMsg} setCurrentPage={this.props.setCurrentPage} />}
              {this.props.messages.length === 0 && <h2>Aucun message</h2>}
            </div>

          </div>
          <div className="container menu_verticale col-md-3 col-lg-3 p-0">
            <div className="row">
              <BarRecherche profil_recherche={this.props.profil_recherche} setCurrentPage={this.props.setCurrentPage} rechercheMessages={this.props.rechercheMessages} rechercheProfils={this.props.rechercheProfils} />



            </div>
          </div>
        </div>
      </div>

    )
  }
}
