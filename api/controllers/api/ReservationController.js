/**
 * ReservationController
 *
 * @description :: Server-side logic for managing reservations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


    findMultiple: function (req, res) {
        Reservation.find().populate('user').populate('customer').populate('work').exec(function callback(err, reservations){
            if(err) return res.serverError(err);
            return res.ok({
                reservations: reservations
            })
        });
    },

    create: function (req, res) {

        var data = {};
        if( req.param('reference') ) data.work = req.param('reference'); // set literary work as reference
        if( req.param('customer') ) data.customer = req.param('customer'); // set customer
        data.user = req.session.userID; // set user

        Reservation.create( data ).exec(function(err, resa){
            if(err){
                if(err.ValidationError) return res.badRequest(err);
                else return res.serverError(err);
            }
            return res.created({
                reservation: resa
            });
        });

    },

    delete: function (req, res) {
        console.log('sdf');
        Reservation.findOne({'ID':req.param('id')}).then(function(reservation){
            if(!reservation) return res.notFound();

            // We destroy
            return Reservation.destroy({ID:req.param('id')}).then(function(){
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
        if( req.param('reference') ) data.work = req.param('reference');
        if( req.param('customer') ) data.customer = req.param('customer');

        // Query to update
        var query = {
            'ID': req.param('id')
        }

        // Update process
        Reservation.update(query, data, function(err, resa) {
            if (err) {
                if(err.ValidationError) return res.badRequest( err );
                else return res.serverError(err);
            }
            if(!resa || resa.length < 1) return res.notFound();

            return res.ok({
                reservation: resa[0]
            });
        });

    }

};

