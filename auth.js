/*
** fwapi
**
** https://github.com/au5ton/fwapi
**
*/

var request = require('request');
var client = require('au5ton-logger');
var colors = require('colors')
var FW = require('./constants.js');

var _ = {};
_.cookie = null;

_.authenticate = function(one,two,callback) {

    if(typeof one === 'string' && typeof two === 'function') {
        //one is a login cookie, two is callback
        client.warn('Pre-authenticating with a cookie is highly unrecommended.');
        client.warn('Please use a username and password.');

        _.cookie = one;
        two();
    }
    else if(typeof one === 'string' && typeof two === 'string' && typeof callback === 'function') {
        //one is username, two is password, callback is callback

        client.log('Attempting to login as: ', colors.blue(one));

        request({
            url: 'https://'+FW.HOST+'/homepage.php',
            method: 'GET',
            followRedirect: false
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                client.log('Saving PHPSESSID cookie...');
                _.cookie = response.headers['set-cookie'][0];

                request({
                    url: 'https://'+FW.HOST+'/scripts/login_check.php',
                    method: 'POST',
                    form: {
                        fw_u_n: one,
                        fw_p_w: two
                    },
                    headers: {
                        'Cookie': _.cookie
                    }
                }, function(error, response, body){
                    if(!error && response.statusCode == 200) {
                        //Correct credentials
                        client.log('Saving verf cookie...');
                        _.cookie += '; '+response.headers['set-cookie'][0];
                        client.success('Login successful!');
                        callback('success');
                    }
                    else if(response.statusCode == 401) {
                        //Wrong credentials
                        client.error('Wrong login credentials given.');
                        callback('fail');
                    }
                    else if(response.statusCode == 418) {
                        //Banned
                        client.error('This account was autobanned.');
                        throw 'autobanned';
                    }
                    if(error) {
                        client.error(error);
                    }
                });

            }
            else {
                client.error(error);
            }
        })

    }
    else {
        client.error('Unknown error in auth.authenticate');
    }
};

_.checkLoginStatus = function(callback) {
    client.log('Checking login status...');
    request({
        url: 'https://'+FW.HOST+'/'+FW.LIVE_CHECK,
        method: 'GET',
        headers: {
            'Cookie': _.cookie
        },
        followRedirect: false
    }, function (error, response, body) {
        if (!error) {
            if(response.statusCode === 200) {
                client.success('Still logged in.');
                callback('success');
            }
            else {
                client.warn('No longer logged in.');
                callback('fail');
            }
        }
        else {
            client.errot(error);
        }
    });
};

module.exports = _;
