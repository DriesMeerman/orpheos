"use strict";
const mysql = require ("mysql");
// const config = require("../../config/dbconfig.json");

let config = {
    "host": process.env.DB_HOST,
    "address": process.env.DB_HOST,//"127.0.0.1",
	"user": process.env.DB_USER,
	"password": process.env.DB_PASSWORD,
    // "socketPath": "/var/run/mysqld/mysqld.sock",
    "port": "3306",
	"database": process.env.DATABASE
}

config.connectionLimit = config.connectionLimit && config.connectionLimit > 15 ? config.connectionLimit : 20;
let pool = mysql.createPool(config);

async function executeQuery(query, values){
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, con) => {
            if (err) {
                reject(err);
                return;
            }

            con.query(query, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
                con.release();
            });

        });
    })
}

module.exports = {
    executeQuery: executeQuery,
	getConnection: pool.getConnection,
    pool: pool,
};