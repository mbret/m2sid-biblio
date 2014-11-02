/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

    'get /dev/dump': function (req, res) {
        req.session.hasVisitedDev = true;
        console.log(req);
        var users = {};
        return res.json(200, {
            session: req.session,
            sessionID: req.sessionID,
            sessionStore: req.sessionStore,
            cookies: req.cookies,
            signedCookies: req.signedCookies
        });
    },


    /*
     * BASIC ROUTES
     */
    'get /': 'DashboardController.index',
    'get /index': 'DashboardController.index',
    'get /login': 'AuthController.login',
    'get /logout': 'AuthController.logout',
    'get /customers': 'DashboardController.customers',
    'get /literaryworks': 'DashboardController.literaryworks',
    'get /literarycopies': 'DashboardController.literarycopies',
    'get /reservations': 'DashboardController.reservations',
    'get /loans': 'DashboardController.loans',

    /*
     * HELPER API
     * - used by application as service but does not follow any rest pattern
     */
    'post /api/login': 'AuthController.loginService',
    'post /api/flash': 'IndexController.flashService',

    /*
     * REST API
     * - used by application as REST service
     */
    'get /api/customers': 'api/CustomerController.findMultiple',
    'post /api/customers': 'api/CustomerController.create',
    'delete /api/customers/:id': 'api/CustomerController.delete',
    'put /api/customers/:id': 'api/CustomerController.update',

    'get /api/literaryworks': 'api/LiteraryWorkController.findMultiple',
    'post /api/literaryworks': 'api/LiteraryWorkController.create',
    'delete /api/literaryworks/:id': 'api/LiteraryWorkController.delete',
    'put /api/literaryworks/:id': 'api/LiteraryWorkController.update',

    'post /api/reservations': 'api/ReservationController.create',
    'get /api/reservations': 'api/ReservationController.findMultiple',
    'delete /api/reservations/:id': 'api/ReservationController.destroy',
    'put /api/reservations/:id': 'api/ReservationController.update',

    'get /api/loans': 'api/LoanController.findMultiple',

};
