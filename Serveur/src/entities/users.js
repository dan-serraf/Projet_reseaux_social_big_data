class Users {
  constructor(db) {
    this.db = db;
    db.exec("CREATE TABLE IF NOT EXISTS 'USERS' (login VARCHAR(512) NOT NULL UNIQUE, PASSWORD VARCHAR(256) NOT NULL, LASTNAME VARCHAR(256) NOT NULL, FIRSTNAME VARCHAR(256) NOT NULL)");
  }


  create(login, password, lastname, firstname) {
    let _this = this;
    //attention saisir dans le json en minuscule
    return new Promise((resolve, reject) => {
      var stmt = _this.db.prepare("INSERT INTO users VALUES (?,?,?,?)");
      stmt.run([login, password, lastname, firstname], (err, res) => {
        if (err)
          reject(err);
        else
          resolve(this.lastID)
      })
    });
  }


  get(user_id) {
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT login, firstname, lastname FROM users WHERE ROWID = ?");
      stmt.get([user_id], (err, res) => {
        if (err)
          reject(err);
        else
          resolve(res);
      })
    });
  }

  recherche(login = '', firstname = '', lastname = '') {
    return new Promise((resolve, reject) => {
      let req = "SELECT ROWID, login FROM users WHERE ";
      let b = false;
      if (login) {
        req += "login LIKE '%" + login + "%'";
        b = true;
      }
      if (firstname) {
        if (b)
          req += " AND "
        req += "firstname LIKE '%" + firstname + "%'";
      }
      if (lastname) {
        if (b)
          req += " AND "
        req += "lastname LIKE '%" + lastname + "%'";
      }
      console.log(req);
      this.db.all(req, (err, rows) => {
        if (err)
          reject(err);
        else
          resolve(rows);
      })
    });
  }


  delete(user_id) {
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("DELETE FROM users where ROWID = ?")
      stmt.run([user_id], (err) => {
        if (err)
          reject(err);
        resolve(this.changes) // ???? Qu'est ce qu'une res pour un delete
      })
    });
  }


  async checkpassword(login, password) {
    /*
      Vérifie si un (login,password) existe et renvoie le ROWID associé
    */
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT ROWID FROM users WHERE login = ? and PASSWORD = ?");
      stmt.get([login, password], (err, res) => {
        if (err)
          reject(err);
        else
          resolve(res);
      });
    });
  }

  async exists(login) {
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT * FROM users WHERE login = ?");
      stmt.get([login], (err, res) => {
        if (err)
          reject(err);
        else
          resolve(res !== undefined);
      })
    });
  }
}

exports.default = Users;

