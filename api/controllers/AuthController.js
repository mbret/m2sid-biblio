
/**
 * IndexController
 *
 * @description :: Server-side logic for managing index
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {

    login: function (req, res) {
//        res.locals.layout = 'layouts/login.ejs';
        return res.view('login', {
            section: 'login',
            title: 'Login'
//            layout: 'layouts/login.ejs'
        });
    },

    logout: function(req, res){
        req.session.authenticated = false;
        req.session.userID = false;
        req.session.userName = false;
        req.flash('success', 'You have been logged out!');
        res.redirect('/');
    },



    /**********************************************
     *
     * Services available for application
     *
     **********************************************/

    loginService: function (req, res) {
        User.findOne({ login: req.param('login'), password: req.param('password')}, function(err, user){
            if(err) return res.serverError(err);
            if(!user){
                return res.notFound();
            }
            else{
                req.session.authenticated = true;
                req.session.userID = user.ID;
                req.session.userName = user.login;
                req.flash('success', 'You have been logged in!');
                return res.ok();
            }
        });
    }



};