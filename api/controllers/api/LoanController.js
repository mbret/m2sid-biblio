/**
 * LoanController
 *
 * @description :: Server-side logic for managing loans
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    findMultiple: function (req, res) {

        var data = {};
        if( req.param('state') ) data.state = req.param('state'); // set literary work as reference

        // Search condition for available copy for rent
        /*if( req.param('available-for') ){
            Loan.find( 'state' ).exec(function callback(err, loans){
                if(err) return res.serverError(err);
                return res.ok({
                    loans: loans
                })
            });
        }*/

        Loan.find( data ).exec(function callback(err, loans){
            if(err) return res.serverError(err);
            return res.ok({
                loans: loans
            })
        });
    }
};

