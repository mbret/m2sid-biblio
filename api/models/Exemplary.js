/**
* Book.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {

        /*
         * BDD fields
         */
        ID: {
            type: 'integer',
            autoIncrement: true,
            unique: true,
            index: true,
            primaryKey: true
        },
        isbn: {
            type: 'integer',
            required: true,
            unique: true
        },
        state: {
            type: 'string',
            enum: ['rented', 'available', 'booked']
        },

        reference: {
            model: 'LiteraryWorkBaseModel'
        },

        work: {
            model: 'literaryWork',
            required: true
        }
    }


};

