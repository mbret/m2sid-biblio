/**
* Customer.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    identity: 'Customer',

  attributes: {

      /*
       * BDD fields
       */
      ID: {
          type: 'integer',
          autoIncrement: true,
          unique: true,
          index: true,
          primaryKey: true,
          columnName: 'customerID'
      },
      name: {
          type: 'string',
          required: true,
          unique: true,
          columnName: "customerName"
      }

      /*
       * Other fields
       */
  }
};

