const User = require('../model/User');

var records = [
  { id: 1, username: 'jack', password: 'secret', displayName: 'Jack' },
  { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill' },
  { id: 3, username: 'dries', password: 'yeet', displayName: 'Dries'},
].map(userData => {
  let user = new User(userData, true);
  // userData.password = user.hashPassword();
  return user;
});

function findById(id, cb) {
  process.nextTick(function () {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

function findByUsername(username, cb) {
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

function insertUser(userObj) {
  if (!userObj.username || !userObj.password){
    return false;
  }
  userObj.
  records.push(userObj);
  return records.length;
}

module.exports = {
  findById: findById,
  findByUsername: findByUsername
}