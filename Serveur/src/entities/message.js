class Message {
    constructor(db) {
        this.db = db
    }

    create(message, user_name, user_id) {
        return new Promise((resolve, reject) => {
            this.db.insert({ author_name: user_name, author_id: user_id, date: new Date(), text: message }, (err, newDoc) => {
                if (err)
                    reject(err);
                else
                    resolve(newDoc);
            });
        });
    }
    delete(msg_id) {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: msg_id }, {}, (err, numRemoved) => {
                if (err)
                    reject(err);
                else
                    resolve(numRemoved);
            })
        });
    }

    modifier(msg_id, msg) {
        return new Promise((resolve, reject) => {
            this.db.update({ _id: msg_id }, { $set: { text: msg } }, {}, (err, numReplaced) => {
                if (err)
                    reject(err);
                else
                    resolve(numReplaced);
            })
        });
    }

    get(msg_id) {
        return new Promise((resolve, reject) => {
            this.db.find({ _id: msg_id }, (err, docs) => {
                if (err)
                    reject(err);
                else
                    resolve(docs);
            })
        });
    }
 

    recherche(id = '', author_name = '', message = '', user_id = '', datedebut = '', datefin = '') {
        return new Promise((resolve, reject) => {
            let req = {};
            let re1 = new RegExp(".*" + author_name + ".*");
            let re2 = new RegExp(".*" + message + ".*");
            if (id)
                req._id = id;
            if (author_name)
                req.author_name = { $regex: re1 };
            if (message)
                req.text = { $regex: re2 };
            if (user_id)
                req.author_id = parseInt(user_id)
            if (datedebut && datefin) {
                req.date = { $and: [{ date: { $lt: Date.parse(datefin) } }, { date: { $gt: Date.parse(datedebut) } }] };
            } else {
                if (datefin)
                    req.date = { date: { $lt: Date.parse(datefin) } }
                if (datedebut)
                    req.date = { date: { $gt: Date.parse(datedebut) } }
            }
            console.log("requete message.js", req)
            this.db.find(req, (err, docs) => {
                if (err)
                    reject(err);
                else {
                    resolve(docs);
                }

            })
        });
    }

    async exists(msg_id) {
        return new Promise((resolve, reject) => {
            this.db.find({ _id: msg_id }, (err, docs) => {
                if (err)
                    reject(err);
                else
                    resolve(docs !== undefined);
            })
        });
    }


    async autorise(msg_id, user_id) {
        return new Promise((resolve, reject) => {
            this.db.find({ _id: msg_id }, (err, docs) => {
                if (err) {
                    reject(err);
                }
                else
                    resolve(docs[0].author_id === user_id);
            })
        });
    }

}
exports.default = Message;
