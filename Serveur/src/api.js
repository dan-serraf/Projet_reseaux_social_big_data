const express = require("express");
const Users = require("./entities/users.js");
const Message = require("./entities/message.js");
const Friend = require("./entities/friend.js");
const { resolve } = require("path");

function init(db, dbm) {

    const router = express.Router();

    // On utilise JSON
    router.use(express.json());

    // enregistreur simple pour les requêtes de ce routeur
    // toutes les requêtes adressées à ce routeur toucheront d'abord ce middleware
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });

    // Definit constante
    const messages = new Message.default(dbm);
    const friends = new Friend.default(db);
    const users = new Users.default(db);

    // #############################################################################################
    // TEST
    // #############################################################################################


    /*
    Afin de tester les fonctions tu met des json avec des users :
    si user valide -> affichage de la bd user
    sinon -> pas 'affichage
    */
    //test pour afficher toute la bd VALIDE
    router
        .route("/affiche_users/")
        .get(async (req, res) => {

            db.each('SELECT * FROM users', (err, data) => console.log(data))
        })

    router
        .route("/affiche_friends/")
        .get(async (req, res) => {

            db.each('SELECT * FROM friends', (err, data) => console.log(data))
        })


    // test la fonction exist users VALIDE
    router
        .route("/affiche/test_exist")
        .get(async (req, res) => {
            const d = req.body;
            console.log(users.exists(d.login).then((aa) => {
                if (aa == true) {
                    db.each('SELECT * FROM users', (err, data) => console.log(data))
                }
            }))

        })

    // test checkpassword VALIDE
    router
        .route("/affiche/test_checkpassword")
        .get(async (req, res) => {
            const d = req.body;
            console.log(users.checkpassword(d.login, d.password).then((aa) => {
                if (aa == true) {
                    db.each('SELECT * FROM users', (err, data) => console.log(data))
                }
            }))

        })

    // #############################################################################################
    // CONNEXION 
    // #############################################################################################
    router
        .route("/signIn")
        //Connexion VALIDE DONT TOUCH PLEASE
        .post(async (req, res) => {
            try {
                const data = req.body;

                // Erreur sur la requête HTTP
                if (!data.login || !data.password) {
                    res.status(400).json({
                        status: 400,
                        message: "Requête invalide : login et password nécessaires"
                    });
                    return;
                }
                // Erreur utilisateur inexistant
                if (! await users.exists(data.login)) {
                    res.status(404).json({
                        status: 404,
                        message: "Utilisateur introuvable."
                    });
                    return;
                }

                // Ici on est sur que l'utilisateur existe afin d'eviter une erreur dans checkpassword
                // On verifie si le code corresponds a l'utilisateur
                let user_id = await users.checkpassword(data.login, data.password);

                if (user_id) {
                    // Avec middleware express-session
                    // Pour verifier s'il la session a regenerer
                    req.session.regenerate(function (err) {
                        if (err) {
                            res.status(500).json({
                                status: 500,
                                message: "Erreur interne"
                            });
                        }
                        else {
                            // C'est bon, nouvelle session créée
                            req.session.user_id = user_id.rowid;
                            req.session.login = data.login; // Peut être à enlever
                            res.status(200).json({
                                status: 200,
                                message: "User et mot de passe accepté",
                                user_id: user_id.rowid
                            });
                        }
                    });
                    return;
                }

                // Faux login : destruction de la session et erreur
                req.session.destroy((err) => { });
                res.status(403).json({
                    status: 403,
                    message: "Mot de passe invalide."
                });
                return;
            }
            catch (e) {
                // Toute autre erreur
                res.status(500).json({
                    status: 500,
                    message: "erreur interne",
                    details: (e || "Erreur inconnue").toString()
                });
            }
        })

    // #############################################################################################
    // DECONNEXION 
    // #############################################################################################

    router
        .route("/signOut")
        // Deconnexion VALIDE DONT TOUCH PLEASE
        .post(async (req, res) => {
            try {
                // Destruction de la connexion    
                if (req.session.user_id) {
                    req.session.destroy((err) => {
                        res.status(200).json({
                            status: 200,
                            message: "Déconnexion réussie."
                        });
                        return;
                    });
                }
                else {
                    res.status(404).json({
                        status: 404,
                        message: "La connexion est introuvable.",
                    });
                }
            }
            catch (e) {
                // Toute autre erreur
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne",
                    details: (e || "Erreur inconnue").toString()
                });
            }
        });

        // #############################################################################################
    // MESSAGE
    // #############################################################################################

    //Création d'un message
    router.post('/messages', (req, res) => {
        const msg = req.body;
        if (!msg.message) {
            res.status(400).send("Missing fields");
        } else {
            // Verifier la connexion
            if (req.session.user_id) { // On fait l'hypothèse que si un connecteur est connecté, il existe
                // Crée le message
                messages.create(msg.message, req.session.login, req.session.user_id)
                    .then((msg_id) => res.status(201).json({ status: 201, id: msg_id })) // msg envoyé
                    .catch((err) => res.status(500).send(err)); // erreur interne
            } else {
                // Probleme d'authentification
                res.status(401).json({
                    status: 401,
                    message: "Pas authentifié"
                });
            }
        }
    })

    router
        .get("/messages", (req, res, next) => {
            let u_id = req.query !== undefined && req.query.user_id !== undefined ? req.query.user_id : req.session.user_id
            let id = req.query !== undefined && req.query.id !== undefined ? req.query.id : ""
            let author_name = req.query !== undefined && req.query.author_name !== undefined ? req.query.author_name : ""
            let message = req.query !== undefined && req.query.message !== undefined ? req.query.message : ""
            let datedebut = req.query !== undefined && req.query.datedebut !== undefined ? req.query.datedebut : ""
            let datefin = req.query !== undefined && req.query.datefin !== undefined ? req.query.datefin : ""
            messages.recherche(id, author_name, message, u_id, datedebut, datefin)
                .then((data) => {
                    // On renvoie le message
                    if (data !== undefined)
                        res.status(201).json(data);
                    else
                        res.status(404).json({
                            status: 404,
                            message: "Message introuvable."
                        })
                })
                .catch((err) => {
                    res.status(500).json({
                        status: 500,
                        message: "Erreur interne messages get."
                    })
                })
        })
        .route("/messages/:msg_id")
        .get((req, res, next) => {
            // S'il existe je récupère les données
            messages.get(req.params.msg_id)
                .then((data) => {
                    // On renvoie le message
                    if (data !== undefined)
                        res.status(201).json(data);
                    else
                        res.status(404).json({
                            status: 404,
                            message: "Message introuvable."
                        })
                })
                .catch((err) => {
                    res.status(500).json({
                        status: 500,
                        message: "Erreur interne messages get."
                    })
                })
        })
        .delete((req, res, next) => {
            // Suppression
            if (!req.session.user_id)
                res.status(403).json({
                    status: 403,
                    message: "Nécessite une connexion."
                })
            messages.exists(req.params.msg_id).then((ex) => {
                if (ex)
                    messages.autorise(req.params.msg_id, req.session.user_id)
                        .then((b) => {
                            if (b)
                                messages.delete(req.params.msg_id)
                                    .then(() => res.status(200).send("Message supprimé"))
                                    .catch((err) => res.status(500).send(err))
                            else
                                res.status(403).json({ status: 403, message: "Accès refusé." })

                        })
                        .catch((err) => {
                            res.status(500).json({ status: 500, message: "Erreur interne message autorise.", error: err });
                        }); //
                else
                    res.status(404).json({
                        status: 404,
                        message: "Message introuvable."
                    })

            }).catch((err) => {
                res.status(500).json({ status: 500, message: "Erreur interne messages exists." })
            });
        })
        // modifie un message
        .put((req, res, next) => {
            const msg = req.body;
            // Suppression
            if (!req.session.user_id)
                res.status(403).json({
                    status: 403,
                    message: "Nécessite une connexion."
                })
            if (!msg.message) {
                res.status(400).json({
                    status: 400,
                    message: "missing fields"
                })
            }
            messages.exists(req.params.msg_id).then((ex) => {
                if (ex)
                    messages.autorise(req.params.msg_id, req.session.user_id)
                        .then((b) => {
                            if (b)
                                messages.modifier(req.params.msg_id, msg.message)
                                    .then((data) => res.status(200).send("Message modifié"))
                                    .catch((err) => res.status(500).json({ status: 500, message: "Erreur interne messages modifier." }))
                            else
                                res.status(403).json({ status: 403, message: "Accès refusé." })

                        })
                        .catch((err) => {
                            res.status(500).json({ status: 500, message: "Erreur interne message autorise.", error: err });
                        });
                else
                    res.status(404).json({
                        status: 404,
                        message: "Message introuvable."
                    })

            })
                .catch((err) => {
                    res.status(500).json({ status: 500, message: "Erreur interne messages exists." })
                });
        })

    // #############################################################################################
    // USERS
    // #############################################################################################

    // Creer un utilisateur VALIDE DONT TOUCH PLEASE
    router
        .post("/signUp", (req, res) => {
            const data = req.body;
            if (!data.login || !data.password || !data.lastname || !data.firstname) {
                res.status(400).send("Missing fields");
            } else {
                users.exists(data.login)
                    .then((ex) => {
                        if (!ex) {
                            users.create(data.login, data.password, data.lastname, data.firstname)
                                .then((user_id) => {
                                    res.status(201).json({ id: user_id });
                                })
                                .catch((err) => res.status(500).json(err)); // Erreur interne
                        } else {
                            res.status(409).json({
                                status: 409,
                                message: "L'utilisateur existe déjà."
                            })
                        }
                    })
                    .catch((err) => res.status(500).json({
                        status: 500,
                        message: err
                    }))
            }
        });



    router.get("/user", (req, res) => {
        
        if (!req.session.user_id)
            res.status(401).json({
                status: 401, // Code de status à changer
                message: "Vous n'êtes pas connectés."
            })
        let login = req.query !== undefined && req.query.login !== undefined ? req.query.login : req.session.login
        let firstname = req.query !== undefined && req.query.firstname !== undefined ? req.query.firstname : ""
        let lastname = req.query !== undefined && req.query.lastname !== undefined ? req.query.lastname : ""
        users.recherche(login, firstname, lastname)
            .then((data) => {
                console.log(data)
                res.status(200).json(data)
            })
            .catch((err) =>
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne user.get.",
                    error: err
                }))
    })
    router.get("/user/:user_id(\\d+)", (req, res) => {
        const user_id = parseInt(req.params.user_id)
        users.get(user_id)
            .then((data) => {
                console.log(data);
                if (data !== undefined) {
                    // Si on trouve l'user, on l'envoie
                    console.log(data)
                    res.status(200).json({ login: data.login, firstname: data.FIRSTNAME, lastname: data.LASTNAME });
                } else {
                    // Si on ne l'a pas trouvé, il n'existe pas
                    res.status(404).json({
                        status: 404,
                        message: "Utilisateur introuvable."
                    })
                }
            })
            .catch((err) => {   //Si la BD est injoignable à priori
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne user.get.",
                    error: err
                })
            })
    })

    // Supprimer un utilisateur RAJOUTER SUPPRIME SES MSG ET LES LIENS D'AMITIES QUI LE CONCERNENT
    router.delete("/user", (req, res) => {
        if (req.session.user_id) {
            users.delete(req.session.user_id).then((nb_changement) => {
                if (nb_changement < 1) {
                    // Si il y a 0 changement c'est sûrement qu'il n'existe pas
                    res.status(404).json({
                        status: 404,
                        message: "Utilisateur introuvable.",
                    });
                } else {
                    // Sinon tout s'est bien passé 
                    res.status(200).json({
                        status: 200,
                        message: "Utilisateur supprimé."
                    })
                }
            })
                .catch((err) => {
                    res.status(500).json({
                        status: 500,
                        message: "Erreur interne user delete."
                    })
                })
        } else {
            res.status(401).json({
                status: 401, // Code de status à changer
                message: "Vous n'êtes pas connectés."
            })
        }
    });

    // #############################################################################################
    // FRIENDS
    // #############################################################################################

    // Creer un lien d'amitier VALIDE DONT TOUCH PLEASE
    router.post("/friend/:ami(\\d+)", (req, res) => {
        const ami = parseInt(req.params.ami);

        if (!req.session.user_id) {
            res.status(401).json({
                status: 401,
                message: "Nécessite une connexion"
            });
        }
        if (!ami) {
            res.status(400).json({
                status: 400,
                message: "Missing fields."
            });
        }
        if (req.session.user_id === ami) {
            res.status(403).json({
                status: 403,
                message: "On ne peut pas être ami avec soi-même."
            });
        }
        users.get(ami)
            .then((data) => {
                if (data !== undefined) {
                    const today = new Date(Date.now());
                    friends.create(req.session.user_id, ami, today.toUTCString())
                        .then((donnee) => res.status(201).json(donnee))
                        .catch((err) => res.status(500).json(err)); // Erreur interne
                } else {
                    res.status(404).json({
                        status: 404,
                        message: "Utilisateur introuvable."
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne userget."
                });
            })


    });


    router
        .route("/friend")
        .get((req, res) => {
            friends.get(req.session.user_id)
                .then((data) => {
                    if (data !== undefined) {
                        // Si on trouve les amis, on les envoie
                        res.status(200).json(data);
                    } else {
                        // Si on ne l'a pas trouvé, il n'existe pas
                        res.status(200).json({
                            status: 200,
                            message: "Aucun ami."
                        })
                    }
                })
                .catch((err) => {   //Si la BD est injoignable à priori
                    res.status(500).json({
                        status: 500,
                        "message": "Erreur interne friendget.",
                        "error": err
                    })
                })
        })

    router
        .route("/followers")
        .get((req, res) => {
            friends.get_vers(req.session.user_id)
                .then((data) => {
                    if (data !== undefined) {
                        // Si on trouve les amis, on les envoie
                        res.status(200).json(data);
                    } else {
                        // Si on ne l'a pas trouvé, il n'existe pas
                        res.status(200).json({
                            status: 200,
                            message: "Aucun ami."
                        })
                    }
                })
                .catch((err) => {   //Si la BD est injoignable à priori
                    res.status(500).json({
                        status: 500,
                        "message": "Erreur interne friendget.",
                        "error": err
                    })
                })
        })


    // Supprimer un lien d'amitier VALIDE DONT TOUCH PLEASE
    router.delete("/friend/:ami(\\d+)", (req, res) => {
        const ami = parseInt(req.params.ami);
        if (!req.session.user_id) {
            res.status(401).send({
                status: 401,
                message: "Nécessite une connexion"
            });
        }
        if (!ami) {
            res.status(400).send({
                status: 400,
                message: "Missing fields."
            });
        }
        friends.delete(req.session.user_id, ami)
            .then((nb_changement) => {
                if (nb_changement < 1) {
                    // Si il y a 0 changement c'est qu'il n'existe pas
                    res.status(404).json({
                        status: 404,
                        message: "Le lien d'amitié n'existe pas",
                    });
                } else {
                    // Sinon tout s'est bien passé 
                    res.status(200).json({
                        status: 200,
                        message: "Lien d'amitié supprimé"
                    })
                }
            })
            .catch((err) => {
                res.status(500).json({
                    status: 500,
                    message: "Erreur interne friends delete."
                })
            })
    })






    return router;
}
exports.default = init;

