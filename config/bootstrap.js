/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var Promise = require("bluebird");

module.exports.bootstrap = function(cb) {

    Promise.all([
        User.create({login: 'maxime', password: 'password'}),
        Customer.create({name: 'Maxime'}),
        Customer.create({name: 'Gael'}),
        Customer.create({name: 'Joris'}),
        Book.create({title:'book 1', workType:'book', volume:1, publishedDate: '2014-10-05'}),
        Book.create({title:'book 2', workType:'book', volume:1, publishedDate: '2012-10-05'}),
        Magazine.create({title:'Magazine a', workType:'magazine', number:18, publishedDate: '2010-08-05'}),
    ]).then(function() {
        sails.log.info('All data loaded inside database');
        return cb();
    }).catch(function(e){
        return cb(e);
    });


};
