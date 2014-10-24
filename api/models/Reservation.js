/**
* Reservation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

//    schema          :true,
    identity: 'Reservation',

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
            model: 'User',
            required: true
        },

        // For whom is the resa
        customer: {
            model: 'Customer',
            required: true
        },

        work: {
            model: 'LiteraryWorkBaseModel',
            required: true
        }
    },

    beforeCreate: function (values, cb) {
        values.bookedAt = new Date();
        return cb();
    }
};

