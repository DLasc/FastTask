function isUser(req, res, next, user) {
// return function(req, res, next){
    console.log('infunc1');
    if (req.session.user.username === user){
        next();
    }
    else{
        console.log('not logged in as correct user');

}
        }

// }

module.exports = isUser;