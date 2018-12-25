const db = require('./connection')
const Project = require('../model/Project');
const CONSTANTS = require('../config/constants')

async function insertProject(project) {
    let query = "INSERT INTO " + CONSTANTS.tables.project  + " SET ?";
    let payload = {
        name: project.name,
        description: project.description, 
        category: project.category, 
        owner: project.owner
    }
    let values = [payload];

    return new Promise(async (resolve, reject) => {
        try {
            var insert = await db.executeQuery(query, values);
            resolve(insert);
        } catch (e){
            reject(e);
        }
    });
};

async function getProjectById(id) {
    let query = "SELECT * FROM " + CONSTANTS.tables.project  + " proj WHERE id = " + id + "ORDER BY proj.id LIMIT 1";
    
        return new Promise(async (resolve, reject) => {
            try {
                var projects = await db.executeQuery(query);
                projects = projects.map(data => new Project(data));
                resolve(projects);
            } catch (ex){
                reject(ex);
            }
        });
};

/**
 * generates a function that will return a promise which if success full will return an array of projects
 * Therefore only select statements are supported, anything that does not return rowdata for the projec table will behave weird
 * @param {string} query questions marks in this string will be replaced by the arguments of the created function in  order surrounded by '' qoutes values will be escaped.
 */
function makeGetFunction(query){
    return async function proj() {
        let values = Array.from(arguments);
        return new Promise(async (resolve, reject) => {
            try {
                var projects = await db.executeQuery(query, values);
                projects = projects.map(data => new Project(data));
                resolve(projects);
            } catch (ex){
                reject(ex);
            }
        });
    };
}

async function updateProject(project) {
    throw Error("Not yet supported");
};

async function deleteProject(id) {
    throw Error("Not yet supported");
};

let findProjectsByName     = makeGetFunction("SELECT * FROM " + CONSTANTS.tables.project + " project WHERE project.name LIKE CONCAT('%', ?,  '%')")
let findProjectsByCategory = makeGetFunction("SELECT * FROM " + CONSTANTS.tables.project + " project WHERE category = ?");
let findProjectsByOwner    = makeGetFunction("SELECT * FROM " + CONSTANTS.tables.project + " project WHERE owner = ?");
let getAllProjects         = makeGetFunction("SELECT * FROM " + CONSTANTS.tables.project + " project LIMIT ?,?");

module.exports = {
    insertProject: insertProject,
    getProjectById: getProjectById,
    getAllProjects: getAllProjects,
    updateProject: updateProject,
    deleteProject: deleteProject,
    findProjectsByName: findProjectsByName,
    findProjectsByCategory: findProjectsByCategory,
    findProjectsByOwner: findProjectsByOwner
}