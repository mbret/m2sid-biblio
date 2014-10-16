
/**
 * IndexController
 *
 * @description :: Server-side logic for managing index
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {

    index: function (req, res) {
        console.log(res.locals);
        return res.view('dashboard/index');
    },

    login: function (req, res) {
//        res.locals.layout = 'layouts/login.ejs';
        return res.view('login', {
            layout: 'layouts/login.ejs'
        });
    },

    logout: function(req, res){
        req.session.authenticated = false;
        req.session.userID = false;
        req.flash('success', 'You have been logged out!');
        res.redirect('/');

    }

};