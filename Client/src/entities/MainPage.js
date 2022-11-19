import React from 'react';
import NavigationPannel from "./NavigationPannel.js";
import Mur from "./Mur.js"
import Profil from "./Profil"
import SignUp from "./SignUp.js"
import Resultats from "./Resultats.js"
import axios from 'axios';

function sort_date(a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
}
export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.api = axios.create({
            baseURL: '/api/',
            timeout: 1000,
            headers: { 'X-Custom-Header': 'foobar' }
        });
        this.api.bind(this);
        this.state = { page: "connexion", connected: false, friends: [], followers: [] };
        this.setConnected = this.setConnected.bind(this);
        this.setLogout = this.setLogout.bind(this);
        this.signUp = this.signUp.bind(this);
        this.setCurrentPage = this.setCurrentPage.bind(this);
        this.rechercheProfils = this.rechercheProfils.bind(this);
        this.rechercheMessages = this.rechercheMessages.bind(this);

        this.addFriends = this.addFriends.bind(this);
        this.deleteFriend = this.deleteFriend.bind(this);

        this.getFriends();


    }


    getFriendsVers() {
        return this.api.get("/followers")
            .then((data) => {
                if (data.data !== [])
                    this.setState({ followers: data.data })
            })
            .catch((err) => console.log(err));
    }

    getFriends() {

        return this.api.get("/friend")
            .then((data) => {
                if (data.data != [])
                    this.setState({ friends: data.data })
            })
            .catch((err) => console.log(err));
    }
    setConnected = (user_name, user_pw) => {
        // Connexion
        this.api.post('/signIn', { login: user_name, password: user_pw })
            .then((response) => {
                if (response.data.status === 200) {
                    this.getFriends().then(
                        () => {
                            this.getFriendsVers().then(
                                () => {
                                    this.setState({ page: "mur", connected: true, uid: response.data.user_id, pid: response.data.user_id })
                                })
                        })
                    /* page : page courante
                       connected : état de la connexion 
                       uid : id de l'utilisateur connecté
                       pid : id du profil qu'on regarde */
                }
            })
            .catch((err) => console.log(err)) // Comportement normal si ya un 404 not found
    }
    setLogout = () => {
        // Deconnexion
        this.api.post('/signOut')
            .then((response) => {
                console.log(response); // à tester la première fois pour voir ce que retourne le serveur
            })
            .catch(() => console.log("deconnexioncatch"))
        this.setState({ page: "connexion", connected: false, uid: null, pid: null, friends: [] })
    }
    deleteFriend(friend_id) {
        return this.api.delete('/friend/' + friend_id)
            .then((response) => {
                let tmp = [...this.state.friends]
                tmp.splice(tmp.indexOf(friend_id), 1)
                this.setState({ friends: tmp })
                console.log(this.state)
            })
            .catch((err) => console.log(err))
    }



    signUp = (data) => {
        /* Transformer en 2 fonctions différentes */
        this.api.post('/signUp', { login: data.login, firstname: data.firstname, lastname: data.lastname, password: data.password },)
            .then((response) => {
                if (response.data.status === 200)
                    this.setState({ page: "connexion", connected: false })
            })
            .catch(() => console.log("catchsignup"))
    }
    setCurrentPage = (page, id = "") => {

        this.setState({ page: page, pid: id });
        console.log("appel setcurrentpage", page, id);
    }
    //<h1 id="twitter" align="center">Twitter</h1>
    rechercheMessages(a) {
        console.log("Appel recherche messages : ", a)
        return new Promise((resolve, reject) => {
            let res = []
            let tmp = [...this.state.friends]
            tmp.push(this.props.uid);
            tmp.map((element) => {
                this.api.get("/messages", { params: { message: a, user_id: element } })
                    .then((elem2) => {
                        res = res.concat(elem2.data);
                        if (element === this.props.uid) {
                            res.sort(sort_date);
                            console.log(res)
                            this.setState({ messages: res })
                            resolve();
                        }
                    })
                    .catch((err) => console.log(err));
            })
        }
        )
    }


    rechercheProfils(a) {
        //let a = this.refs.recherche.value;
        console.log("appel recherche profil :", a)
        return this.api.get("/user", { params: { login: a } })
            .then((elem) => {
                this.setState({ profils: elem.data });
                console.log("profils correspondants : ", elem.data)
            })
            .catch((err) => console.log(err));
    }
    addFriends(ami) {
        /*
        Le problme dans la fonction est queami est un login et nous on a besoin de rowid   
        */
        return this.api.post("/friend/" + ami)
            .then((data) => {
                if (data.data)
                    this.setState({ friends: this.state.friends.concat("" + ami) })
                console.log(this.state)
            })
            .catch((err) => console.log(err));
    }
    render() {
        return (<div>

            <main className="principal">
                {this.state.page === 'resultats'
                    && <Resultats logout={this.setLogout} messages={this.state.messages} api={this.api} uid={this.state.uid} profil_recherche={this.state.profils} setCurrentPage={this.setCurrentPage} rechercheMessages={this.rechercheMessages} rechercheProfils={this.rechercheProfils} />}
                {this.state.page === 'mur'
                    && <Mur logout={this.setLogout} api={this.api} uid={this.state.uid} deleteFriend={this.deleteFriend} profil_recherche={this.state.profils} setCurrentPage={this.setCurrentPage} rechercheMessages={this.rechercheMessages} rechercheProfils={this.rechercheProfils} friends={this.state.friends} followers={this.state.followers} />}
                {this.state.page === 'signup'
                    && <SignUp signup={this.signUp} setCurrentPage={this.setCurrentPage} />}
                {this.state.page === "profil"
                    && <Profil logout={this.setLogout} api={this.api} uid={this.state.uid} profil_recherche={this.state.profils} pid={this.state.pid} deleteFriend={this.deleteFriend} rechercheMessages={this.rechercheMessages} rechercheProfils={this.rechercheProfils} addFriends={this.addFriends} setCurrentPage={this.setCurrentPage} friends={this.state.friends} followers={this.state.followers} />}
                <NavigationPannel className="menu_item menu"
                    page={this.state.page}
                    connected={this.state.connected}
                    login={this.setConnected}
                    logout={this.setLogout}
                    signup={this.signUp}
                    setpage={this.setCurrentPage}
                />
            </main>

        </div>
        )
    }
}
/*
{this.state.connected
                && <Barre/>}
                */