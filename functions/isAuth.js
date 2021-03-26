var isAuth = function(req, res, next){
    console.log('isAuth');
    if(req.session.isAuth){
        console.log('authed');
        next();
    }
    else {
        console.log('User not Authenticated');
    }
}

module.exports = isAuth;