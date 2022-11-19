const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); // c'est l'app "express"
//import { describe, it } from 'mocha'
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API user", () => {
    mocha.it("user", (done) => {
        const request = chai.request(app.default).keepOpen();
        const user = {
            login: "aaaaaaaaaa",
            password: "aaaaaaaaaa",
            lastname: "aaaaaaaaaa",
            firstname: "aaaaaaaaaa"
        };
        const user2 = {
            login: "a",
            password: "a",
            lastname: "a",
            firstname: "a"
        };

        const user3 = {
            login: "a",
            firstname: "a"
        };

        const user4 = {
            login: "zaza",
            password: "aza",
            lastname: "zaz",
            firstname: "zaza"
        };

        const user5 = {
            login: "a",
            password: "b",
            lastname: "a",
            firstname: "a"
        };
        // #############################################################################################
        // CREATION
        // #############################################################################################

        request
            .post('/api/signIn')
            .send(user2)

            .then((res) => {
                res.should.have.status(200);
                return Promise.all([
                    /* NEW
                    request
                    .post('/api/signUp')
                    .send(user)
                    .then( res => {
                        res.should.have.status(201);
                    })
                    
                    */

                    // EXISTE DEJA
                    request
                        .post('/api/signUp')
                        .send(user2)
                        .then(res => {
                            res.should.have.status(409);
                        }),


                    // MISSING FIELDS
                    request
                        .post('/api/signUp')
                        .send(user3)
                        .then(res => {
                            res.should.have.status(400);
                        }),


                    //PAS CONNECTER
                    request
                        .get('/api/user')
                        .send(user2)
                        .then(res => {
                            res.should.have.status(401);
                        }),


                    // DONNEE MANQUANTE
                    request
                        .post('/api/signIn')
                        .send(user3)
                        .then(res => {
                            res.should.have.status(400);
                        }),


                    // NOT FOUND
                    request
                        .post('/api/signIn')
                        .send(user4)
                        .then(res => {
                            res.should.have.status(404);
                        }),


                    // LOGIN / MOT DE PASSE INVALIDE
                    request
                        .post('/api/signIn')
                        .send(user5)
                        .then(res => {
                            res.should.have.status(403);
                        }),


                    // CONNNEXION REUSSIS
                    request
                        .post('/api/signIn')
                        .send(user2)
                        .then(res => {
                            res.should.have.status(200);
                        }),


                    // DECONNEXION NON EXISTANTE
                    request
                        .post('/api/signOut')
                        .send(user4)
                        .then(res => {
                            res.should.have.status(404);
                        }),



                    // SUPPRIME USERS NON TROUVER
                    request
                        .delete('/api/user')
                        .send(user)
                        .then(res => {
                            res.should.have.status(401);
                        }),


                    // DECONNEXION NON EXISTANTE
                    request
                        .post('/api/signOut')
                        .send(user4)
                        .then(res => {
                            res.should.have.status(404);
                        })

                ])
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })



    })
})

