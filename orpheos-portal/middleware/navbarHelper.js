const CONSTANTS = require('../config/constants');


function addNavitemsToLocals(req, res, next){
    let navItems = [];

    if (req.user) {
        navItems.push({name: "Profile", link: "/profile"})

        if (req.user.accessLevel >= CONSTANTS.roles.ADMIN.value){
            navItems.push({name: "Administration", link: "/admin"})
        }
    }
    navItems.push({name: "Test", link: "/test"});

    res.locals.navItems = navItems;
    return next();
}

module.exports = {
    addNavitemsToLocals: addNavitemsToLocals
}