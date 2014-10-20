
/**
 * IndexController
 *
 * @description :: Server-side logic for managing index
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {

    index: function (req, res) {
        return res.view('dashboard/index', {
            section: 'dashboard',
            title: 'Home'
        });
    },

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

    customers: function(req, res){
        return res.view('dashboard/customers', {
            section: 'dashboard'
        })
    },

    /**
     *
     * @param req
     * @param res
     * @returns {*}
     */
    literaryworks: function(req, res){
        return res.view('dashboard/literaryworks', {
            works: null,
            section: 'dashboard'
        })
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
    },

    /**
     * Service used in order to register a flash message for futur request.
     * For example if application is using REST service but want to pass a message to next request. As REST service are stateless
     * this call is required to inject flash message inside session.
     * @param req
     * @param res
     * @returns {*}
     */
    flashService: function(req, res){
        req.flash( req.param('type'), req.param('message'));
        return res.ok();
    }

};