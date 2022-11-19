import React from "react"
import Logout from "./Logout"
class MenuGauche extends React.Component {

    send() {
        this.props.addMessage(this.refs.message.value)
    }

    render() {
        return (

            <div className="bar_verticale text-center">
                <h2> Birdy </h2>
                <div className="menu_item" onClick={() => this.props.setCurrentPage("mur")}><a><img className="menu" src={process.env.PUBLIC_URL + "/image/accueil.svg"} />Accueil</a></div>
                <div className="menu_item" onClick={() => this.props.setCurrentPage("profil", this.props.uid)}> <a><img className="menu" src={process.env.PUBLIC_URL + "/image/profil.svg"}></img>Profil</a></div>
                <div className="menu_item">  <a ><img className="menu" src={process.env.PUBLIC_URL + "/image/message.svg"}></img>Message</a></div>
                <div className="menu_item"> <a ><img className="menu" src={process.env.PUBLIC_URL + "/image/parametre.svg"}></img>Paramètres</a></div>
                <div className="menu_item"> <a ><img className="menu" src={process.env.PUBLIC_URL + "/image/notification.svg"}></img>Notifications</a></div>
                <div className="menu_bas">
                    <Logout logout={this.props.logout} setpage={this.props.setpage} />
                </div>

            </div>

        )
    }
}

export default MenuGauche;
///