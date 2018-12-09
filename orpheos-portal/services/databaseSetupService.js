const retry = require('async-retry')
const db = require('../db/connection');
const CONSTANTS = require('../config/constants');

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
    let insertUserQuery = "INSERT INTO `user` (`id`, `display_name`, `user_name`, `password`, `access_level`) VALUES (NULL, 'Admin', 'admin', '$2a$12$UqaXAflkcYz7wPxqnpp6HublPKx5Lopy6WP841.pc98yKxOaBIdt6', " + CONSTANTS.roles.ADMIN + ");";

    let queries = [createDBQuery, createUserTableQuery, insertUserQuery];
    var promises = [];

    return new Promise(async (res, rej) => {
        console.log('Start db init');
        try {
            console.log("TRY DB CREATE")
            await executeQuery(createDBQuery);
            console.log('a')
        } catch (e){
            console.log('ERRa')
        }

        try {
            console.log("TRY DB TABLE")
            await executeQuery(createUserTableQuery);
            console.log('b')
        } catch (e){
            console.log('ERRb')
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

    // queries.forEach((query) => {
    //     promises.push(new Promise(function (resolve, reject) {
    //         db.pool.getConnection((err, con) => {
    //             if (err) {
    //                 reject(err);
    //                 return;
    //             }
    //             console.log("inserting " + query);

    //             con.query(query, null, (err, result) => {
    //                 if (err) {
    //                     reject(err);
    //                 } else {
    //                     resolve(result);
    //                 }
    //                 con.release();
    //             });

    //         });
    //     }));
    // });

    // return Promise.all(promises);

    // Promise.all(promises).then((values) => {
    //     console.log('done insertion', values);
    // })
    // return promises;
}

async function executeQuery(query){
    return new Promise(function (resolve, reject) {
        db.pool.getConnection((err, con) => {
            console.log("inserting " + query);
            if (err) {
                console.log('error bruh')
                reject(err);
                return;
            }
            

            con.query(query, null, (err, result) => {
                console.log('query callback')
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
                console.log('release connection')
                con.release();
            });

        });
    });
}

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