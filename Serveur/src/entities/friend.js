class Friend {
  constructor(db) {
    this.db = db
    let req = "CREATE TABLE IF NOT EXISTS friends (depuis VARCHAR(512) NOT NULL, vers VARCHAR(512) NOT NULL, date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (depuis, vers))"
    db.exec(req);
  }

  create(depuis, vers, date) {
    let _this = this;
    return new Promise((resolve, reject) => {
      var stmt = _this.db.prepare("INSERT INTO friends VALUES (?,?,?)");
      stmt.run([depuis, vers, date], (err, res) => {
        if (err)
          reject(err);
        else
          resolve(vers);
      })
    });
  }

  delete(depuis, vers = -1) {
    return new Promise((resolve, reject) => {
      var sql = "DELETE FROM friends where depuis = ? and vers = ?";
      //if (vers !== -1)
      //    sql += "and vers = ?";
      var stmt = this.db.prepare(sql);
      stmt.run([depuis, vers], (err) => {
        if (err)
          reject(err);
        else
          resolve(this.changes) // ???? Qu'est ce qu'une res pour un delete
      })
    });
  }

  get(user_id) {
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT vers FROM friends WHERE depuis = ?");
      stmt.all([user_id], (err, res) => {
        if (err)
          reject(err);
        let tmp = []
        res.map(element => tmp.push(element.vers));
        resolve(tmp);
      })
    });
  }


  get_vers(user_id) {
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT vers FROM friends WHERE vers = ?");
      stmt.all([user_id], (err, res) => {
        if (err)
          reject(err);
        let tmp = []
        res.map(element => tmp.push(element.vers));
        resolve(tmp);
      })
    });
  }



  async is_friend(depuis, vers) {
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT * FROM friends WHERE depuis = ? and vers = ?");
      stmt.get([depuis, vers], (err, res) => {
        if (err)
          reject(err);
        else
          resolve(res !== undefined);
      })
    });
  }
}
exports.default = Friend;
