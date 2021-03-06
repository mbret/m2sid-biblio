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
        LiteraryWork.create({title:'book 1', workType:'book', volume:1, publishedDate: '2014-10-05'}),
        LiteraryWork.create({title:'book 2', workType:'book', volume:1, publishedDate: '2012-10-05'}),
        LiteraryWork.create({title:'Magazine a', workType:'magazine', number:18, publishedDate: '2010-08-05'}),
        Reservation.create({bookedAt:'2010-08-05 22:12:00', work:1, user:1, customer:1}),
        Reservation.create({work:1, user:1, customer:2}),
        Reservation.create({work:3, user:1, customer:3}),
        Reservation.create({work:2, user:1, customer:3}),

    ]).then(function() {
        return Promise.all([
            Exemplary.create({isbn:1234, state:'available', reference:1, state:'rented'}),
            Exemplary.create({isbn:1244, state:'available', reference:1}),
            Exemplary.create({isbn:1534, state:'available', reference:1}),
            Exemplary.create({isbn:9876, state:'available', reference:3})
        ]);
    }).then(function() {
        return Promise.all([
            Loan.create({work:1, customer:3 , copy:1, user:1})

        ]);
    }).then(function() {
        sails.log.info('All data loaded inside database');
        return cb();
    }).catch(function(e){
        return cb(e);
    });


};
