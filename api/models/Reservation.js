/**
* Reservation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {

    tableName: 'reservation',
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,

    attributes: {

        ID: {
            type: 'integer',
            autoIncrement: true,
            unique: true,
            index: true,
            primaryKey: true
        },

        bookedAt: {
            type: 'date'
        },

        // User that make resa
        user: {
            model: 'user',
            required: true
        },

        // For whom is the resa
        customer: {
            model: 'customer',
            required: true
        },

        work: {
            model: 'literaryWork',
            required: true
        }
    },

    beforeCreate: function (values, cb) {
        values.bookedAt = new Date();
        return Reservation.checkIfForeignKeysExist( values, cb );
    },

    beforeUpdate: function (values, cb) {
        return Reservation.checkIfForeignKeysExist( values, cb );
    },

    /**
     * Check if foreign keys are respected when create/update
     * Needed because shema built by sails doesnt register foreign key constraints
     * @param values
     * @param cb
     */
    checkIfForeignKeysExist: function(values, cb){
        require("bluebird").props({
            customer: Customer.findOne(values.customer),
            work: LiteraryWork.findOne(values.work),
            user: User.findOne(values.user)
        }).then(function( results ){
            var errFound;
            if( ! results.user ) errFound = 'key user';
            if( ! results.customer ) errFound = 'key customer';
            if( ! results.work ) errFound = 'key work';
            if( errFound ){
                var error = new Error('Foreign key constraint failed for reservation model with ' + errFound);
                error.code = 'E_VALIDATION';
                error.ValidationError = true;
                return cb( error );
            }
            else{
                return cb();
            }
        }).catch(function(e){
            return cb(e);
        });
    }
};

