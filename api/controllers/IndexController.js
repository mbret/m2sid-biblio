
/**
 * IndexController
 *
 * @description :: Server-side logic for managing index
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {


    /**********************************************
     *
     * Services available for application
     *
     **********************************************/

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