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
    'get /': 'indexController.index',
    'get /index': 'indexController.index',
    'get /login': 'IndexController.login',
    'get /logout': 'IndexController.logout',
    'get /customers': 'IndexController.customers',


    /*
     * HELPER API
     * - used by application as service but does not follow any rest pattern
     */
    'post /api/login': 'IndexController.loginService',
    'post /api/flash': 'IndexController.flashService',

    /*
     * REST API
     * - used by application as RESTFUL service (no persistence)
     */
    'get /api/customers': 'api/CustomerController.findMultiple',
    'post /api/customers': 'api/CustomerController.create',
    'delete /api/customers/:id': 'api/CustomerController.delete',
    'put /api/customers': 'api/CustomerController.update'

};