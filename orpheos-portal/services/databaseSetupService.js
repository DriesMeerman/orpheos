const retry = require('async-retry')
const db = require('../db/connection');
const CONSTANTS = require('../config/constants');
const User = require("../model/User");

let executeQuery = db.executeQuery;

const sqlQueries = {
    TABLE:{
        USER: "CREATE TABLE `orpheos`.`user` (`id` INT NOT NULL AUTO_INCREMENT ,`display_name` VARCHAR(20) NOT NULL ,`user_name` VARCHAR(20) NOT NULL ,`password` VARCHAR(60) NOT NULL , `access_level` INT, `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,`updated` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,PRIMARY KEY (`id`), UNIQUE (`user_name`));",
        CATEGORY: "CREATE TABLE `orpheos`.`category` (`id` INT NOT NULL AUTO_INCREMENT ,`name` VARCHAR(64) NOT NULL ,`description` VARCHAR(255), `parent` INT ,PRIMARY KEY (`id`), FOREIGN KEY (`parent`) REFERENCES category(`id`) ON DELETE CASCADE);",
        PROJECT: "CREATE TABLE `orpheos`.`project` (`id` INT NOT NULL AUTO_INCREMENT ,`name` VARCHAR(64) NOT NULL ,`description` VARCHAR(255) ,`category` INT ,`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,`updated` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,PRIMARY KEY (`id`), FOREIGN KEY (`category`) REFERENCES category(`id`));",
        PROJECT_MEMBER: "CREATE TABLE `orpheos`.`project_member` (`id` INT NOT NULL AUTO_INCREMENT ,`project` INT NOT NULL,`user` INT NOT NULL,PRIMARY KEY (`id`),FOREIGN KEY (`project`) REFERENCES project(`id`),FOREIGN KEY (`user`) REFERENCES user(`id`));",
        POST: "CREATE TABLE `orpheos`.`post` (`id` INT NOT NULL AUTO_INCREMENT ,`title` VARCHAR(64) NOT NULL ,`description` VARCHAR(255) ,`user` INT ,`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,`updated` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,PRIMARY KEY (`id`), FOREIGN KEY (`user`) REFERENCES user(`id`));",
        POST_COMMENT: "CREATE TABLE `orpheos`.`post_comment` (`id` INT NOT NULL AUTO_INCREMENT ,`text` VARCHAR(255) ,`user` INT NOT NULL,`post` INT NOT NULL,`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,`updated` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,PRIMARY KEY (`id`),FOREIGN KEY (`post`) REFERENCES post(`id`),FOREIGN KEY (`user`) REFERENCES user(`id`));",
        PICTURE: "CREATE TABLE `orpheos`.`picture` (`id` INT NOT NULL AUTO_INCREMENT ,`name` VARCHAR(64) NOT NULL ,`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,`updated` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,PRIMARY KEY (`id`));",
        POST_PICTURE: "CREATE TABLE `orpheos`.`post_picture` (`id` INT NOT NULL AUTO_INCREMENT ,`post` INT NOT NULL,`picture` INT NOT NULL,PRIMARY KEY (`id`),FOREIGN KEY (`post`) REFERENCES picture(`id`),FOREIGN KEY (`picture`) REFERENCES post(`id`));",
    }
}


function dbTestThing() {
    db.users.findById('1', (err, res) => {
        console.log('RAW USER DATA FROM DB', res);
        let user = new User(res);
        console.log('user', user);
    });
    db.users.findByUsername('admin', (err, res) => {
        console.log('RAW USER DATA FROM DB BY NAME', res);
        let user = new User(res);
        console.log('user', user);
    });
    let dries = new User({ id: 3, username: 'dries', password: 'yeet', displayName: 'Dries' }, true);
    db.users.insertUser(dries, (result) => {
        console.log('inserted user', result);
    });
}

function setupDatabase() {
    //const db = require('./db/connection')

    var handelDbIssue = (err) => {
        //console.log('Error: ', err);
        console.log('Running db setup')
        var promises = continueSetup();
        Promise.all(promises).then((values) => {
            console.log('done insertion', values);
        })
    }

    db_exist_query().then((res) => {

        db_userTableExists_query().then((result) => {
            console.log('db already exists skipping..');
        }).catch(handelDbIssue)


    }).catch(handelDbIssue)

}

async function initializeDatabase() {
    let createDBQuery = "CREATE DATABASE `orpheos`;";
    let createUserTableQuery = "CREATE TABLE `orpheos`.`user` ( `id` INT NOT NULL AUTO_INCREMENT ,`display_name` VARCHAR(20) NOT NULL , `user_name` VARCHAR(20) NOT NULL , `password` VARCHAR(60) NOT NULL , `access_level` INT, PRIMARY KEY (`id`), UNIQUE (`user_name`));";
    
    let admin = new User({username: "admin", password: "admin", accessLevel: CONSTANTS.roles.GOD.value, displayName: "Administrator" }, true);
    let insertUserQuery = "INSERT INTO `user` (`id`, `display_name`, `user_name`, `password`, `access_level`) VALUES (NULL, '" + admin.displayName + "', '" + admin.username + "', '" + admin.password + "', " + admin.accessLevel + ");";

    // let queries = [createDBQuery, createUserTableQuery, insertUserQuery];
    // var promises = [];

    return new Promise(async (res, rej) => {
        console.log('Start db init');
        try {
            console.log("TRY DB CREATE")
            await executeQuery(createDBQuery);
        } catch (e){
            console.log('ERRa')
        }

        try {
            console.log("TRY DB TABLE")
            // await executeQuery(createUserTableQuery);
            await executeQuery(sqlQueries.TABLE.USER);
            await executeQuery(sqlQueries.TABLE.CATEGORY);
            await executeQuery(sqlQueries.TABLE.PROJECT);
            await executeQuery(sqlQueries.TABLE.PROJECT_MEMBER);
            await executeQuery(sqlQueries.TABLE.POST);
            await executeQuery(sqlQueries.TABLE.PICTURE);
            await executeQuery(sqlQueries.TABLE.POST_COMMENT);
            await executeQuery(sqlQueries.TABLE.POST_PICTURE);
        } catch (e){
            console.log('ERR', e);
        }

        try {
            console.log("TRY USER INSERT")
            let userInsert = await executeQuery(insertUserQuery);
            console.log("USER INSERT RESULT: ", userInsert);
        } catch (e){
            console.log("FAILED TO INSERT USER");
            rej(e);
        }
        res(true, 'great success');
    });

}

// async function executeQuery(query){
//     return new Promise(function (resolve, reject) {
//         db.pool.getConnection((err, con) => {
//             console.log("inserting " + query);
//             if (err) {
//                 console.log('error bruh')
//                 reject(err);
//                 return;
//             }
            

//             con.query(query, null, (err, result) => {
//                 console.log('query callback')
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(result);
//                 }
//                 console.log('release connection')
//                 con.release();
//             });

//         });
//     });
// }

async function db_userTableExists_query() {
    let que = `SELECT * FROM orpheos.user LIMIT 1;`;
    return new Promise(function (resolve, reject) {
        db.pool.getConnection((err, con) => {
            if (err) {
                reject(err);
                return;
            }
            if (!con) {
                reject(arguments);
                return;
            }

            con.query(que, null, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
                con.release();
            });

        });
    });
}

async function db_exist_query() {
    let que = `SHOW DATABASES LIKE 'orpheos';`;
    return new Promise(function (resolve, reject) {
        db.pool.getConnection((err, con) => {
            if (err) {
                reject(err);
                return;
            }
            if (!con) {
                reject(arguments);
                return;
            }

            con.query(que, null, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
                con.release();
            });

        });
    });
}

async function checkConnection() {
    return retry(db_exist_query, {
        minTimeout: 6000,
        retries: 10
    });
}

async function validateDatabase() {
    return new Promise(async (resolve, reject) => {
        console.log('validate database');
        let canConnect;
        let tablesValid;
        let dataValid;
    
        try {
            canConnect = await checkConnection();
            console.log('Succeeded in connecting');
        } catch (ex) {
            console.log('Cannot connect to database', ex);
            reject(ex);
            process.exit(CONSTANTS.exit_codes.DB_FAILURE);
        }
    
        try {
            tablesValid = await validateTables();
        } catch (ex) {
            let dbInit;
            console.log('Problem with database, will attempt to fix');
            try {
                dbInit = await initializeDatabase()
            } catch (e) {
                console.log('DB setup had errors', e);
                // reject(e);
            }
            
            console.log('Initialize database', dbInit);
            reject(ex);
        }
        resolve(true, 'DB is valid');
    });
}

async function validateTables() {
    return db_userTableExists_query();
}

module.exports = {
    validateDatabase: validateDatabase,
    checkConnection: checkConnection
}