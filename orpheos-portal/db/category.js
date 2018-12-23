const db = require('./connection')
const Category = require('../model/Category');
const CONSTANTS = require('../config/constants')


async function loadCategories(start, end) {
    let query = "SELECT * FROM " + CONSTANTS.tables.category  + " cat ORDER BY cat.id LIMIT ?, ?";
    let values = [start, end];

    return new Promise(async (resolve, reject) => {
        var categories = await db.executeQuery(query, values);
        categories = categories.map(data => new Category(data));
        resolve(categories);
    });
};

async function insertCategory(category){
    let query = "INSERT INTO " + CONSTANTS.tables.category  + " SET ?";
    let payload = {
        name: category.name,
        description: category.description,
        parent: category.parent
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
    
}

async function deleteCategory(id) {
    let query = "DELETE FROM " + CONSTANTS.tables.category  + " WHERE id = ?";
    let values = [id];
        
    return new Promise(async (resolve, reject) => {
        try {
            var categories = await db.executeQuery(query, values);
            resolve(categories);
        } catch (ex) {
            reject(ex);
        }
    });
}


module.exports = {
    loadCategories: loadCategories,
    insertCategory: insertCategory,
    deleteCategory: deleteCategory,
}