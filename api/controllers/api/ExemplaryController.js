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


    delete: function (req, res){
        Exemplary.findOne({'ID':req.param('id')}).then(function(exemplary){
            if(!exemplary) return res.notFound();

            // We destroy
            return Exemplary.destroy({ID:req.param('id')});

        }).then(function(){
            return res.ok();
        }).catch(function(err){
            return res.serverError(err);
        });
    },

    update: function (req, res) {

        // Check required params
        if( !req.param('id') ) return res.badRequest();

        // copy data
        var data = {};
        if( req.param('isbn') ) data.isbn = req.param('isbn');
        if( req.param('reference') ) data.reference = req.param('reference');

        // Query to update
        var query = {
            'ID': req.param('id')
        }

        // Update process
        Exemplary.update(query, data, function(err, exemplaries) {
            console.log(exemplaries);
            if (err) {
                if(err.ValidationError) return res.badRequest( err );
                else return res.serverError(err);
            }
            if(!exemplaries || exemplaries.length < 1) return res.notFound();

            return res.ok({
                exemplary: exemplaries[0]
            });
        })
    
    }
};

