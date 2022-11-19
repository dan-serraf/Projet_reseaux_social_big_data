import React from 'react';
import MessagesList from "./MessagesList"
import MenuGauche from "./MenuGauche"
import BarRecherche from "./BarRecherche"

function sort_date(a, b) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}


export default class Profil extends React.Component {
  constructor(props) {
    super(props); // this.props.pid : profil
    this.state = { messages: [] }; //user_id des friends
    this.getMessage(this.props.pid).then((res) => this.state.messages =res.sort(sort_date));
    this.getUser(this.props.pid);

    this.deleteMsg = this.deleteMsg.bind(this);
    this.putMsg = this.putMsg.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset(page, pid) {
    this.props.setCurrentPage(page, pid)
    this.getMessage(pid).then((arg) => this.setState({ messages: arg.sort(sort_date) }));
    this.getUser(pid);

  }
  putMsg(msg_id) {

    let i = 0;
    while (i < this.state.messages.length) {
      if (this.state.messages[i]._id === msg_id)
        break;
      ++i;
    }
    return this.props.api.put('/messages/' + msg_id)
      .then((response) => {

      })
      .catch((err) => console.log(err))
  }

  deleteMsg(msg_id) {
    let i = 0;
    while (i < this.state.messages.length) {
      if (this.state.messages[i]._id === msg_id)
        break;
      ++i;
    }
    return this.props.api.delete('/messages/' + msg_id)
      .then((response) => {
        let tmp = this.state.messages.slice()
        tmp.splice(i, 1)
        this.setState({ messages: tmp, nb_tweets: this.state.nb_tweets - 1 })
      })
      .catch((err) => console.log(err))
  }

  getUser(pid) {
    console.log("Appel get user profil :", pid)
    return this.props.api.get("/user/" + pid)
      .then((data) => {
        if (data.data !== [])
          this.setState({ login: data.data.login, firstname: data.data.firstname, lastname: data.data.lastname })
      })
      .catch((err) => console.log(err));
  }
  getMessage(pid) {
    /* A besoin d'un changement sur le serveur pour trouver tous les msg d'author_id*/
    console.log("get message profil pid ", pid)
    return new Promise((resolve, reject) => {
      this.props.api.get("/messages", { params: { user_id: pid } })
      .then((data) => {
        if (data.data !== [])
          resolve(data.data);
      })
      .catch((err) => console.log(err));
    })
  }




  render() {
    return (
      <div className="mur p-0">
        <div className="row p-0 m-0">
          <div className="menu_verticale col-md-2 col-lg-2 p-0">
            <MenuGauche setCurrentPage={this.reset} uid={this.props.uid} logout={this.props.logout}/>
          </div>
          <div className="container col-md-7 col-lg-7 p-0">
            <div className="container p-0" id="mur_headers">
              <div className="container fond_baniere" ><img src={process.env.PUBLIC_URL + "/image/image_sign_in.jpg"} width="70%" height="60%" /></div>
            </div>
            <div className="container">
              <div className="presentation">{this.state.login}  {this.state.firstname}  {this.state.lastname}</div>
              {this.props.uid !== this.props.pid && !this.props.friends.includes("" + this.props.pid) && <button type="button" className="btn btn-dark bar_recherche" onClick={() => this.props.addFriends(this.props.pid)}>Ajouter ami</button>}
            </div>
            <div className="container">
              {this.props.uid !== this.props.pid && this.props.friends.includes("" + this.props.pid) > 0 && <button type="button" className="btn btn-dark bar_recherche" onClick={() => this.props.deleteFriend(this.props.pid)}>Retirer ami</button>}

              {this.state.messages && <MessagesList putMsg={this.putMsg} messages={this.state.messages} uid={this.props.uid} deleteMsg={this.deleteMsg} setCurrentPage={this.props.setCurrentPage} />}

            </div>

          </div>
          <div className="container menu_verticale col-md-3 col-lg-3 p-0">
            <div className="row">
              <BarRecherche profil_recherche={this.props.profil_recherche} setCurrentPage={this.reset} rechercheMessages={this.props.rechercheMessages} rechercheProfils={this.props.rechercheProfils} />
            </div>

          </div>
        </div> </div>
    )
  }
}
