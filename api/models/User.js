/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

//    connection: 'mySQLDb',
    identity: 'User',
//    schema          :true,

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
      login: {
          type: 'string',
          required: true,
          unique: true
      },
      password: {
          type: 'string',
          minLength: 1,
          required: true
      }

  }

};
