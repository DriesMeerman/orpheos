const User = require('../model/User');
const db = require('./connection')


var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack' },
    { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill' },
    { id: 3, username: 'dries', password: 'yeet', displayName: 'Dries' },
    { id: 4, username: 'admin', password: 'admin', displayName: 'Admin' }
].map(userData => {
    let user = new User(userData, true);
    // userData.password = user.hashPassword();
    return user;
});

function findById(id, cb) {
    process.nextTick(function () {
        let query = "SELECT * FROM user WHERE id = ?";
        let values = [id];
        db.executeQuery(query, values).then((result) => {
            
            if (result.length > 0){
                let user = new User(result[0]);
                cb(null,user);
            } else {
                cb(new Error('User ' + id + ' does not exist'));
            }
        })
    });
}

function findByUsername(username, cb) {
    process.nextTick(function () {
        let query = "SELECT * FROM user WHERE user_name = ?";
        let values = [username];
        db.executeQuery(query, values).then((result) => {
            
            if (result.length > 0){
                let user = new User(result[0]);
                cb(null,user);
            } else {
                cb(false);
            }
        })
    });
};

function insertUser(user, cb){
    process.nextTick(function () {
        let query = "INSERT INTO user SET ?";
        let payload = {
            display_name: user.displayName,
            user_name: user.username,
            password: user.password
        }
        let values = [payload];
        db.executeQuery(query, values).then((result) => {
            
            if (result.length > 0){
                let user = new User(result[0]);
                cb(null,user);
            } else {
                cb(false);
            }
        })
    });
}

// function findById(id, cb) {
//     process.nextTick(function () {
//         var idx = id - 1;
//         if (records[idx]) {
//             cb(null, records[idx]);
//         } else {
//             cb(new Error('User ' + id + ' does not exist'));
//         }
//     });
// }

// function findByUsername(username, cb) {
//     process.nextTick(function () {
//         for (var i = 0, len = records.length; i < len; i++) {
//             var record = records[i];
//             if (record.username === username) {
//                 let user = new User(record);
//                 console.log(user);
//                 return cb(null, user);
//             }
//         }
//         return cb(null, null);
//     });
// }

module.exports = {
    // findById_my: findById_my,
    // findByUserName_my: findByUserName_my,
    insertUser: insertUser,
    findById: findById,
    findByUsername: findByUsername
}