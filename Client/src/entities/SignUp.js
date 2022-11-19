import React from 'react'


export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { login: "", password: "", firstname: "", lastname: "" };
        this.send = this.send.bind(this);
    }
    send() {
        this.props.signup(this.state);
        this.props.setCurrentPage("connexion")

    }
    render() {
        return (
            <section className="my-4 mx-5" align="center">
                <div className="container">
                    <div className="row no-gutters ">
                        <div className="col-xs-0 col-sm-0 col-md-3 col-lg-3"></div>
                        <div align="center">
                            <div className="mt-5 px-5 pt-5 col-xs-12 col-sm-12 col-md-6 col-lg-6" id="balise_input_centre">
                                <h1>Création d'un compte</h1>
                                <form>
                                    <div className="form-row ">
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                            <label for="login"></label>
                                            <input className="form-control my-1 p-3 balise_input" placeholder="Nom d'utilisateur" type="text" id="login" name="user_login" onChange={(event) => this.setState({ login: event.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-row ">
                                        <div className=" col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                            <label for="password"></label>
                                            <input className="form-control my-1 p-3 balise_input" placeholder="Mot de passe" type="password" id="password" name="user_pw" ref="password" onChange={(event) => this.setState({ password: event.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-row ">
                                        <div className=" col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                            <label for="firstname"></label>
                                            <input className="form-control my-1 p-3 balise_input" placeholder="Firstname" type="text" id="firstname" name="user_firstname" onChange={(event) => this.setState({ firstname: event.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-row ">
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                            <label for="lastname"></label>
                                            <input className="form-control my-1 p-3 balise_input" placeholder="Lastname" type="text" id="lastname" name="user_lastname" onChange={(event) => this.setState({ lastname: event.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                                            <button className="button btn1 mt-3 mb-5 w-25 balise_input" type="button" onClick={() => this.send()}>Valider</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-xs-0 col-sm-0 col-md-3 col-lg-3"></div>

                    </div>
                </div>
            </section>
        )
    }
}