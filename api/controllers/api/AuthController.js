/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    login: function (req, res) {
        User.findOne({ login: req.param('login'), password: req.param('password')}, function(err, user){
            if(err) return res.serverError(err);
            if(!user){
                return res.notFound();
            }
            else{
                req.session.authenticated = true;
                req.session.userID = user.ID;
                console.log(req.session);
                return res.ok();
            }
        });
    },


};

