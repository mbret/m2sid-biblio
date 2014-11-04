/**
 * LoanController
 *
 * @description :: Server-side logic for managing loans
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    findMultiple: function (req, res) {


        Loan.find( ).populate('work').populate('copy').populate('user').populate('customer').exec(function callback(err, loans){
            if(err) return res.serverError(err);
            return res.ok({
                loans: loans
            })
        });


    },

    /**
     * Create a loan
     * - switch one copy from available to rented
     * @todo use db transaction
     * @param req
     * @param res
     */
    create: function (req, res) {

        // Get only rights params
        var data = {};
        data.customer = req.param('customer'); // set literary work as reference
        data.work = req.param('reference'); // set customer
        data.user = req.session.userID; // set user

        // Validate params
        var errors = Loan.validateFields( Loan.ACTION_CREATE, data );
        if(errors) return res.badRequest(errors);

        // Start creation process
        // Get copy
        Exemplary.findOne({ state:'available', reference:data.work}).exec(function(err, copy){
            if(err) return res.serverError(err);
            if( !copy ) return res.serverError(err); // script took too many time, a loan has been made before this time

            // Update state
            copy.state = 'rented';
            copy.save(function(err, copyUpdated) {
                if(err) return res.serverError(err);

                // Create loan
                data.copy = copyUpdated.ID;
                Loan.create( data ).exec(function(err, loan){
                    if(err) return res.serverError(err);

                    // Remove resa from this user
                    Reservation.destroy({customer:data.customer, work:data.work}).exec(function(err){
                        if(err) return res.serverError(err);
                        return res.created({
                            loan: loan
                        });
                    })

                });
            });

        });
    },

    /**
     * Delete a loan. (when user give back book)
     * - set the copy as available
     * @param req
     * @param res
     */
    delete: function (req, res) {
        Loan.findOne({'ID':req.param('id')}).then(function( loan ){
            if(!loan) return res.notFound();

            // We destroy
            return Loan.destroy({ID:req.param('id')}).then(function(){
                return loan;
            });

        }).then(function( loan ){
            console.log(loan);
            // Then set copy as available
            return Exemplary.update({ID:loan.copy}, {state:'available'}).then(function(){
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

        // Query to update
        var query = {
            'ID': req.param('id')
        }

        // Update process
        Loan.update(query, data, function(err, loans) {
            if (err) {
                if(err.ValidationError) return res.badRequest( err );
                else return res.serverError(err);
            }
            if(!loans || loans.length < 1) return res.notFound();

            return res.ok({
                loan: loans[0]
            });
        });

    }
};

