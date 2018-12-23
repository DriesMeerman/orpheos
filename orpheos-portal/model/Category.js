class Category {
    constructor (catObj){
        this.id = catObj.id || null;
        this.name = catObj.name || null;
        this.description =  catObj.description || null;
        this.parent = catObj.parent  || null;
    }
}

module.exports = Category;