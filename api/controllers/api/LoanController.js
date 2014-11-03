/**
 * LoanController
 *
 * @description :: Server-side logic for managing loans
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    findMultiple: function (req, res) {

        // Search condition for available copy for rent
        if( req.param('available-for') ){
            var customerID = req.param('available-for');

            // find available copies
            LiteraryWork.find().populate('copies', {state: 'available'}).exec(function callback(err, works){
                if(err) return res.serverError(err);

                works = _.toArray(works);
//                console.log(works);

                // For each copies check resa
                // If number of copies > resa OR one resa is from the customer then OK
                var availableWorks = [];
                // recursive function to check availability for all copies (asynchronous problem)
                function checkResaForCopy( index, next ){
                    if( ! works.length < index ) return next(); // if we reach the end of works collection
                    // Check resa for this current literary work
                    Reservation.find({work: works[index].ID}).exec(function(err, reservations){
                        if(err) return next( err );

                        // Check resa for this cutomer
                        var hasResa = false; // if the customer has one resa for this work
                        _.forEach( reservations, function( reservation ) { if(reservation.customer == customerID ) hasResa = true; });
                        if( works[index].copies.length > reservations.length || hasResa ){
                            availableWorks.push( works[index] );
                        }
                        // if again in array then process
                        checkResaForCopy( index + 1, next );
                    });
                };

                checkResaForCopy( 0, function(){
                    if(err) return res.serverError(err);
                    return res.ok({
                        works: availableWorks
                    });
                });

            });
        }
        else{
            var data = {};
            Loan.find( data ).populate('customer').exec(function callback(err, loans){
                if(err) return res.serverError(err);
                return res.ok({
                    loans: loans
                })
            });
        }

    },

    /**
     * Create a loan
     * - switch one copy from available to rented
     * @todo use db transaction
     * @param req
     * @param res
     */
    create: function (req, res) {

//        if( ! _.isNumber(req.param('customer')) || !_.isNumber( req.param('reference')) ){
//            return res.badRequest();
//        }

        var data = {};
        data.customer = req.param('customer'); // set literary work as reference
        data.work = req.param('reference'); // set customer
        data.user = req.session.userID; // set user

        // Get copy
        Exemplary.findOne({ state:'available', reference:data.work}).exec(function(err, copy){
            if(err) return res.serverError(err);
            if( !copy ) return res.serverError(err); // script took too many time, a loan has been made before this time

            // Update state
            Exemplary.update({state:'rented'}, {ID:copy.ID}, function(err, copyUpdated) {
                if(err) return res.serverError(err);
                if(!copyUpdated || copyUpdated.length < 1) return res.serverError(err); // script took too many time, a loan has been made before this time

                // Create loan
                data.copy = copyUpdated[0].ID;
                Loan.create( data ).exec(function(err, loan){
                    if(err){
                        if(err.ValidationError) return res.badRequest(err);
                        else return res.serverError(err);
                    }
                    return res.created({
                        loan: loan
                    });
                });
            });

        });



    },

    delete: function (req, res) {
        Loan.findOne({'ID':req.param('id')}).then(function( loan ){
            if(!loan) return res.notFound();

            // We destroy
            return loan.destroy({ID:req.param('id')}).then(function(){
                return res.ok();
            });

        }).fail(function(err){
            return res.serverError(err);
        });

    }
};

