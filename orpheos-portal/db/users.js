const User = require('../model/User');

var records = [
  { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [{ value: 'jack@example.com' }]},
  { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [{ value: 'jill@example.com' }]},
  { id: 3, username: 'dries', password: 'yeet', displayName: 'Dries', emails: [{ value: 'bla@example.com' }]},
].map(userData => {
  let user = new User(userData);
  userData.password = user.hashPassword();
  return userData;
});

exports.findById = function (id, cb) {
  process.nextTick(function () {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

exports.findByUsername = function (username, cb) {
  process.nextTick(function () {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        let user = new User(record);
        console.log(user);
        return cb(null, user);
      }
    }
    return cb(null, null);
  });
}
