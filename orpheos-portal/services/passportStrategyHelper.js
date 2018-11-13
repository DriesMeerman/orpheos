
const db = require('../db')

class PassportStrategyHelper {

    static verifyLocalUser (username, password, cb) {
        db.users.findByUsername(username, function (err, user) {
          if (err) {
            return cb(err);
          }
          if (!user) {
            return cb(null, false);
          }
          console.log("Checking pass ", password, user)
          if (!user.checkPassword(password)) {
            return cb(null, false);
          }
          return cb(null, user);
        });
      }

}

module.exports = PassportStrategyHelper;