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

async function getCategoryMenuArray(){
    let categories = [];
    let error;
    try {
        categories = await loadCategories(0, 100);
    } catch (ex){
        error = ex;
    }

    let catObject = {};
    categories.forEach(cat => {
        catObject[cat.id] = {
            name: cat.name,
            parent: cat.parent,
            children: []
        }
    });

    categories.forEach(cat => {
        if (cat.parent) {
            catObject[cat.parent]
                .children.push(catObject[cat.id]);
        }
    });

    let topLevel = categories.filter(x => !x.parent);
    let result = topLevel.map(item => {
        return catObject[item.id];
    });


    return new Promise((resolve, reject) => {
        if (error) return reject(error);
        resolve(result);
    });
}

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
    getCategoryMenuArray: getCategoryMenuArray
}