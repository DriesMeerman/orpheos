


function redirectNonAuthorized(redirectUrl){
   return function notAuthRedirect(req, res, next) {
        if (!req.user) {
            res.redirect(redirectUrl);
        } else {
            return next();
        }
    }
}

module.exports = {
    redirectNonAuthorized: redirectNonAuthorized
}