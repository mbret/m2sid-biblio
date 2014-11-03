/**
* Loan.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

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
  }
};

