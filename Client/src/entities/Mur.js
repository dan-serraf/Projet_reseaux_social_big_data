import React from 'react'
import FriendList from "./FriendList"
import MessagesList from "./MessagesList"
import FormAddMessage from "./FormAddMessage"
import MenuGauche from './MenuGauche'
import BarRecherche from './BarRecherche'

function sort_date(a, b) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}
export default class Mur extends React.Component {
  constructor(props) {
    super(props);
    this.addMessage = this.addMessage.bind(this);

    this.deleteMsg = this.deleteMsg.bind(this);
    this.putMsg = this.putMsg.bind(this);
    this.state = { users: {}, messages: [] }; //user_id des friends
    this.getUser();
    this.getMessage();
  }

  getUser() {
    this.props.api.get("/user/" + this.props.uid)
      .then((data) => {
        if (data.data !== [])
          this.setState({ login: data.data.login, firstname: data.data.firstname, lastname: data.data.lastname })
      })
      .catch((err) => console.log(err));
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


  getMessage() {
    let tmp = [...this.props.friends]
    if (!tmp.includes(""+this.props.uid))
      tmp.push(""+this.props.uid);
    console.log(tmp)
    return new Promise((resolve, reject) => {
      let i = 0
      let res = []
      tmp.map((element) => {
        this.props.api.get("/messages", { params: { user_id: element } })
          .then((data) => {
            i++;
            res = res.concat(data.data)
            if (i === tmp.length){
              this.setState({ messages: res.sort(sort_date) })
              console.log(res)
              resolve();
            }
            if (this.props.uid === element)
              this.setState({ nb_tweets: data.data.length })
          })
          .catch((err) => reject(err));
      })
    })
  }
  addMessage(message) {
    return this.props.api.post("/messages", { message: message })
      .then((data) => {
        let tmp = [...this.state.messages]
        tmp.unshift(data.data.id)
        this.setState({ messages: tmp, nb_tweets: this.state.nb_tweets + 1 })
      })
      .catch((err) => console.log(err))
  }
  render() {
    return (

      <div className="mur p-0">
        <div className="row p-0 m-0">
          <div className="menu_verticale col-md-2 col-lg-2 p-0">
            <MenuGauche setCurrentPage={this.props.setCurrentPage} uid={this.props.uid} logout={this.props.logout}/>
          </div>
          <div className="container col-md-7 col-lg-7 p-0">
            <div className="container p-0" id="mur_headers">
              <div className="container fond_baniere p-0" ><img src={process.env.PUBLIC_URL + "/image/image_sign_in.jpg"} width="70%" height="60%" /></div>
            </div>
            <div className="container p-0">
              <FormAddMessage addMessage={this.addMessage} />

              {this.state.messages && <MessagesList putMsg={this.putMsg} messages={this.state.messages} uid={this.props.uid} deleteMsg={this.deleteMsg} setCurrentPage={this.props.setCurrentPage} />}

            </div>

          </div>
          <div className="container menu_verticale col-md-3 col-lg-3 p-0">
            <div className="row">
              <BarRecherche profil_recherche={this.props.profil_recherche} setCurrentPage={this.props.setCurrentPage} rechercheMessages={this.props.rechercheMessages} rechercheProfils={this.props.rechercheProfils} />



              <div className="container fond_baniere p-4" ><img src={process.env.PUBLIC_URL + "/image/photo_profil.jpg"} width="125" height="125" /></div>
            </div>
            <div className="text-center"><div>{this.state.users.firstname} {this.state.users.lastname}</div></div>
            <div className="text-center"><div>Tweets {this.state.messages.length} </div></div>
            <div className="text-center">Following {this.props.friends.length}</div>
            <div className="text-center">Followers {this.props.followers.length}</div>
            <h2 className="text-center p-4">Amis</h2>
            {this.props.friends && <FriendList api={this.props.api} friends={this.props.friends} uid={this.props.uid} deleteFriend={this.props.deleteFriend} setCurrentPage={this.props.setCurrentPage} />}
          </div>
        </div>
      </div>

    )
  }
}
