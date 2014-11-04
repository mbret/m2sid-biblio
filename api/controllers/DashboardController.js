
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
            section: 'dashboard',
            title: 'Customers'
        })
    },

    /**
     *
     */
    literaryworks: function(req, res){
        return res.view(viewPath + '/literaryworks', {
            title: 'Literary works',
            section: 'dashboard'
        })
    },

    literarycopies: function(req, res){
        LiteraryWork.find( function callback(err, works){
            if(err) return res.serverError(err);
            return res.view(viewPath + '/literarycopies', {
                references: works,
                section: 'dashboard',
                title: 'Literary copies'
            })
        });

    },

    reservations: function(req, res){
        var data = {
            section: 'dashboard',
            title: 'Reservations'
        };

        LiteraryWork.find().then(function( works ) {
            data.references = works;
            return Customer.find().then(function( customers ) {
                data.customers = customers;
            });

        }).then(function() {
            return res.view(viewPath + '/reservations', data );

        }).catch(function(err){
            return res.serverError(err);
        });
    },


    loans: function(req, res){
        Customer.find().exec(function( err, customers ) {
            if(err) return res.serverError(err);
            return res.view(viewPath + '/loans', {
                section: 'dashboard',
                title: 'Loans',
                customers: customers
            })
        });
    }

};