const User = require('../model/User');
const db = require('./connection')

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
        }).catch((err) => {
            cb(false, err);
        });
    });
};

function removeUserById(id, cb) {
    process.nextTick(function () {
        let query = "DELETE FROM user WHERE id = ?";
        let values = [id];
        db.executeQuery(query, values).then((result) => {
            cb(null,result);
            // if (result.length > 0){
            //     let user = new User(result[0]);
                
            // } else {
            //     cb(new Error('User ' + id + ' does not exist'));
            // }
        }).catch( err => {
            cb (err, false);
        })
    });
}

function loadUsers(start, end, cb) {
    process.nextTick(function () {
        let query = "SELECT * FROM user u ORDER BY u.id LIMIT ?, ?";
        let values = [start, end];
        db.executeQuery(query, values).then((result) => {
            
            if (result.length > 0){
                let users = result.map(user => {
                    let data = user;
                    delete data.password;
                    return new User(data);
                });
                cb(null,users);
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
            password: user.password,
            access_level: user.accessLevel
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

function updateUser(user, cb){
    process.nextTick(function () {
        let query = "UPDATE user SET ? WHERE id = ?";
        let payload = {
            display_name: user.displayName,
            password: user.password,
            access_level: user.accessLevel
        }
        if (!payload.password){
            delete payload.password;
        }
        if (!payload.display_name){
            delete payload.display_name;
        }
        let values = [payload, user.id];
        db.executeQuery(query, values).then((result) => {
            cb(null, result);
        }).catch(err => cb(err));
    });
}

module.exports = {
    loadUsers: loadUsers,
    insertUser: insertUser,
    updateUser: updateUser,
    removeUserById: removeUserById,
    findById: findById,
    findByUsername: findByUsername
}