/**
 * LoanController
 *
 * @description :: Server-side logic for managing loans
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    findMultiple: function (req, res) {
        Customer.find().exec(function callback(err, customers){
            if(err) return res.serverError(err);
            return res.ok({
                customers: customers
            })
        });
    },


    create: function (req, res) {

        var data = {};
        if ( req.param('name') ) data.name = req.param('name');

        // Create customer
        Customer.create( data ).exec(function(err, customer){
            if(err){
                if(err.ValidationError) return res.badRequest(err);
                else return res.serverError(err);
            }

            return res.created({
                customer: customer
            });
        });
    },

    delete: function (req, res) {

        // If we find customer
        Customer.findOne({'ID':req.param('id')}).then(function(customer){
            if(!customer) return res.notFound();

            // We destroy
            return Customer.destroy({ID:req.param('id')}).then(function(){
                return res.ok();
            });

        }).fail(function(err){
            return res.serverError(err);
        });

    },


    update: function (req, res) {

        // Check required params
        if( !req.param('id') ) return res.badRequest();

        // user data
        var data = {};
        if ( req.param('name') ) data.name = req.param('name');

        // Query to update
        var query = {
            'ID': req.param('id')
        };

        // Update process
        Customer.update(query, data, function(err, customer) {

            if (err) {
                if(err.ValidationError) return res.badRequest( err );
                else return res.serverError(err);
            }
            if(!customer || customer.length < 1) return res.notFound();

            return res.ok({
                customer: customer[0]
            });
        });

    }


};

