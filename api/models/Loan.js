/**
* Loan.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var validator = require('validator');

module.exports = {

  attributes: {

      ID: {
          type: 'integer',
          autoIncrement: true,
          unique: true,
          index: true,
          primaryKey: true
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
      },

      copy: {
          model: 'exemplary',
          required: true
      }
  },

    ACTION_CREATE: 1,

    /**
     * Check all fields required for a specific action.
     *
     * @todo use custom and global message like 'param %s required'
     * @param action
     * @param fields
     * @returns {*}
     */
    validateFields: function( action, fields ){

        var err = null;

        // validate for create form
        if(action == Loan.ACTION_CREATE){
            // customer (number, required)
            if(!validator.isNumeric(fields.customer)) err = { customer: { rule: 'number', message: 'Not a number'} };
            // work (number, required)
            if(!validator.isNumeric(fields.work)) err = { customer: { rule: 'number', message: 'Not a number'} };
            // user (number, required)
            if(!validator.isNumeric(fields.user)) err = { customer: { rule: 'number', message: 'Not a number'} };
        }

        return err; // err or null
    }
};

