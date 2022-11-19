const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); // c'est l'app "express"
//import { describe, it } from 'mocha'
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API user", () => {
    mocha.it("friends", (done) => {
        const request = chai.request(app.default).keepOpen();
        const user = {
            login: "n",
            password: "n",
            lastname: "n",
            firstname: "n"
        };
        const user2 = {
            login: "a",
            password: "a",
            lastname: "a",
            firstname: "a"
        };

        // CREATION AMI
            request
            .get('/api/friend')
            .send(user2)

            .then((res) => {
                res.should.have.status(200);
                return Promise.all([
                

                    // AMI EXISTE DEJA
                    request
                        .post('/api/friend/1')
                        .send(user2)
                        .then(res => {
                            res.should.have.status(401);
                        }),


                    // LISTE FOLLOWING
                    request
                        .get('/api/friend')
                        .send(user)
                        .then(res => {
                            res.should.have.status(200);
                        }),


                    // LISTE FOLLOWERS
                    request
                        .get('/api/followers')
                        .send(user2)
                        .then(res => {
                            res.should.have.status(200);
                        }),




                    // SUPPRIME FRIENDS NON TROUVER
                    request
                        .delete('/api/friend/1')
                        .send(user)
                        .then(res => {
                            res.should.have.status(401);
                        }),


    

                ])
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })



    })
})

