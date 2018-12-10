const CONSTANTS = require('../config/constants');


function redirectNonAuthorized(redirectUrl){
   return function notAuthRedirect(req, res, next) {
        if (!req.user) {
            return res.redirect(redirectUrl);
        } else {
            return next();
        }
    }
}

function accessRedirect(role, url){
    return function(req, res, next){
        if (!req.user){
            return res.redirect(url);
        }
        if (req.user && req.user.accessLevel < role.value){
            return res.redirect('/status/403');
        }
        return next();
    }
}



module.exports = {
    redirectNonAuthorized: redirectNonAuthorized,
    accessRedirect: accessRedirect

}