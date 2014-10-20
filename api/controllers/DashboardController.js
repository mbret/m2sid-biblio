
/**
 * IndexController
 *
 * @description :: Server-side logic for managing index
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var viewPath = 'dashboard/views';

module.exports = {

    index: function (req, res) {
        return res.view(viewPath + '/index', {
            section: 'dashboard',
            title: 'Home'
        });
    },

    customers: function(req, res){
        return res.view(viewPath + '/customers', {
            section: 'dashboard'
        })
    },

    /**
     *
     */
    literaryworks: function(req, res){
        return res.view(viewPath + '/literaryworks', {
            works: null,
            section: 'dashboard'
        })
    },

    literarycopies: function(req, res){
        LiteraryWorkBaseModel.find( function callback(err, works){
            if(err) return res.serverError(err);
            return res.view(viewPath + '/literarycopies', {
                references: works,
                section: 'dashboard'
            })
        });

    }

};