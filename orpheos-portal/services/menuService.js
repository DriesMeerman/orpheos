const db = require('../db');

class MenuService {
    static createHomeScreenMenu(user) {
        return new Promise(async (resolve, reject) => {
            let categories = [];
            try {
                categories = await db.category.getCategoryMenuArray();
            } catch (ex) {
                reject(ex);
            }
            
            let menu = [
                {
                    icon: 'fa-university',
                    name: 'Library',
                    children: [
                        {
                            icon: 'fa-code',
                            name: 'Temp',
                            link: '/project/all'
                        },
                        {
                            icon: 'fa-globe',
                            name: 'All Projects',
                            link: '/home/projects'
                        },
                        {
                            icon: 'fa-home',
                            name: 'My Projects',
                            link: '/project/user/' + user.id
                        },
                        // {
                        //     icon: 'fa-user',
                        //     name: 'My Subscriptions'
                        // },
                    ]
                }
            ];

            if (categories) {
                categories = categories.map(addLinkToCategory);
                menu.push({
                    icon: 'fa-tasks',
                    name: 'Categories',
                    children: categories
                });
            }

            resolve(menu);
        });
    }
}

/**
 * Loops through all the categories and their children, and generates a link that points to the project/category page for that category.
 * @param {Category} cat 
 */
function addLinkToCategory(cat){
    cat.link = "/project/category/" + cat.id;
    if (cat.children && cat.children.length > 0){
        cat.children.map(addLinkToCategory);
    }
    return cat;
};

module.exports = MenuService;