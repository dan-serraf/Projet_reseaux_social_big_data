import React from 'react';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { login: "", password: "" };
        this.send = this.send.bind(this);
    }

    send() {

        this.props.login(this.state.login, this.state.password);
    }

    render() {
        return (
            <section className="my-4 mx-5" align="center">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-0 col-sm-0 col-md-3 col-lg-3"></div>
                        <div align="center">
                            <div className="mt-5 px-5 pt-5 col-xs-12 col-sm-12 col-md-6 col-lg-6" id="balise_input_centre">
                                <h1 >Se connecter à Birdy</h1>
                                <form>
                                    <div className="form-row ">
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                            <label htmlFor="login"></label>
                                            <input className="form-control my-1 p-3 balise_input" placeholder="Nom d'utilisateur" type="text" id="login" name="user_login" onChange={(event) => this.setState({ login: event.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-row ">
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                            <label htmlFor="password"></label>
                                            <input className="form-control my-1 p-3 balise_input" type="password" id="password" placeholder="Mot de passe" name="user_pw" ref="password" onChange={(event) => this.setState({ password: event.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                                            <button className="button btn1 mt-3 mb-5 w-25 balise_input" type="button" onClick={() => this.send()}>Login</button>
                                        </div>
                                    </div>
                                    <a href="#">Mot de passe oublié ?</a>
                                    <p>
                                        Pas encore inscrit ? <a href="#" onClick={() => this.props.setpage("signup")}>Clique ici</a>
                                    </p>
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