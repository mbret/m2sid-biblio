/**
 * LiteraryWorkController
 *
 * @description :: Server-side logic for managing literaryworks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    findMultiple: function (req, res) {

        // get book and magazines
        LiteraryWorkBaseModel.find( function callback(err, works){
            if(err) return res.serverError(err);
            return res.ok({
                works: works
            });
        });
    },


    create: function (req, res) {

        var data = {};
        if( req.param('title') ) data.title = req.param('title');
        if( req.param('publishedDate') ) data.publishedDate = req.param('publishedDate');
        if( req.param('type') ) data.workType = req.param('type');
        if( req.param('volume') ) data.volume = req.param('volume');
        if( req.param('number') ) data.number = req.param('number');

        var object = null;
        var type = '';
        switch( req.param('type') ){
            case 'book':
                object = Book;
                break;
            case 'magazine':
                object = Magazine;
                break;
            default : return res.badRequest('Please specify a type');
        }
        object.create( data ).exec(function(err, work){
            if(err){
                if(err.ValidationError) return res.badRequest(err);
                else return res.serverError(err);
            }
            return res.created({
                type: work
            });
        });

    },

    delete: function (req, res) {

        LiteraryWorkBaseModel.findOne({'ID':req.param('id')}).then(function(work){
            if(!work) return res.notFound();

            // We destroy
            return work.destroy({ID:req.param('id')}).then(function(){
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
        if ( req.param('title') ) data.title = req.param('title');

        // Query to update
        var query = {
            'ID': req.param('id')
        }

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

