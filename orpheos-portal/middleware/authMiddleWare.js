const CONSTANTS = require('../config/constants');


function redirectNonAuthorized(redirectUrl){
   return function notAuthRedirect(req, res, next) {
        if (!req.user) {
            res.redirect(redirectUrl);
        } else {
            return next();
        }
    }
}

function checkRole(role) {
    return function (req, res, next){
        if (typeof(role) === 'string'){
            role = CONSTANTS.roles[role];
        }

        req.access_level = req.user.role;//role;

        next();
    }
}

module.exports = {
    redirectNonAuthorized: redirectNonAuthorized,
    checkRole: checkRole

}