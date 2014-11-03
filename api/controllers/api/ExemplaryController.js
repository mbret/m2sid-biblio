/**
 * LiteraryWorkController
 *
 * @description :: Server-side logic for managing literaryworks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    create: function (req, res) {

        var data = {};
        if( req.param('isbn') ) data.isbn = req.param('isbn');
        if( req.param('reference') ) data.reference = req.param('reference');
        data.state = 'available';

        Exemplary.create( data ).exec(function(err, exemplary){
            if(err){
                if(err.ValidationError) return res.badRequest(err);
                else return res.serverError(err);
            }
            return res.created({
                exemplary: exemplary
            });
        });

    },

    findMultiple: function (req, res){

        Exemplary.find({}).populate('reference').exec(function(err, results){
            if (err) { return res.serverError(err)};
            console.log(results)
            return res.ok({
                copies: results
            });
        });
    },
};

