/**
* _LiteraryWork.js
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
          primaryKey: true,
          columnName: 'literaryworkID'
      },
      title: {
          type: 'string',
          required: true,
          unique: true,
          columnName: "literaryworkTitle"
      },
      publishedDate: {
          type: 'date',
          required: true,
          columnName: "literaryworkPublishedDate"
      },
        workType: {
            type: 'string',
            required: true,
            columnName: "literaryworkType"
        },
        // Book field
        volume: {
            type: 'integer',
            columnName: 'bookVolume',
            required: true
        },
        // magazine field
        number: {
            type: 'integer',
            columnName: "magazineNumber",
            required: true
        }

    },

    /**
     * - magazine or book field are set (depend of the type) to avoid book validation when working with magazine and vice versa
     * @param values
     * @param cb
     * @returns {*}
     */
    beforeValidate: function (values, cb) {
        if( values.workType == 'book' ){
            values.number = 0;
        }
        if( values.workType == 'magazine' ){
            values.volume = 0;
        }
        return cb();
    },

    /**
     * - magazine or book field are set to null (depend of the type) to restore relevant value inside DB
     * @param values
     * @param cb
     * @returns {*}
     */
    beforeCreate: function(values, cb){
        if( values.workType == 'book' ){
            values.number = null;
        }
        if( values.workType == 'magazine' ){
            values.volume = null;
        }
        return cb();
    }

};

