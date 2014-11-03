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
    }

    update: function (req, res) {

        // Check required params
        if( !req.param('id') ) return res.badRequest();

        // user data
        var data = {};
        if( req.param('title') ) data.title = req.param('title');
        if( req.param('publishedDate') ) data.publishedDate = req.param('publishedDate');
        if( req.param('type') ) data.workType = req.param('type');
        if( req.param('volume') ) data.volume = req.param('volume');
        if( req.param('number') ) data.number = req.param('number');

        // Query to update
        var query = {
            'ID': req.param('id')
        }

        // Update process
        LiteraryWork.update(query, data, function(err, works) {
            console.log(works);
            if (err) {
                if(err.ValidationError) return res.badRequest( err );
                else return res.serverError(err);
            }
            if(!works || works.length < 1) return res.notFound();

            return res.ok({
                work: works[0]
            });
        });
    
};

