const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); // c'est l'app "express"
//import { describe, it } from 'mocha'
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API message", () => {
    mocha.it("message", (done) => {
        const request = chai.request(app.default).keepOpen();
    
        const user = {
            login: "a",
            password: "a",
            lastname: "a",
            firstname: "a"
        };

        const message = {
            id : "1111",
            message : "holla"
        }
        const message2 = {
            id : "111",
            
        }

        // CREATION MESSAGE
         request
            .post('/api/messages')
            .send(message)
            .then((res) => {
                res.should.have.status(401);
                return Promise.all([
               
                    // MISSING FIELD
                    request
                        .post('/api/messages')
                        .send(message2)
                        .then(res => {
                            res.should.have.status(400);
                        }),

                    // MESSAGE
                    request
                        .get('/api/messages')
                        .send(message2)
                        .then(res => {
                            res.should.have.status(201);
                        }),

                     // MESSAGE ID
                     request
                     .get('/api/messages/1111')
                     .send(message2)
                     .then(res => {
                         res.should.have.status(201);
                     }),


                ])
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })



    })
})

