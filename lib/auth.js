/*
** fwapi
**
** https://github.com/au5ton/fwapi
**
*/
'use strict';

var request = require('request');
var client = require('au5ton-logger');
var colors = require('colors');
var crypto = require('crypto');
const algorithm = 'aes-256-ctr';
var fs = require('fs');
var FW = require('./constants.js');

var _ = {};
_.cookie = null;

_.authenticate = function(one,two,callback,saveCookie) {
    if(typeof one === 'string' && typeof two === 'function') {
        //one is a login cookie, two is callback
        client.warn('Pre-authenticating with a cookie is highly unrecommended.');
        client.warn('Please use a username and password.');
        client.warn('Pre-authenticated cookies can\'t be saved to the disk.');

        _.cookie = one;
        two();
    }
    else if(typeof one === 'string' && typeof two === 'string' && typeof callback === 'function') {
        //one is username, two is password, callback is callback

        client.log('Attempting to login as: ', colors.blue(one));

        if(saveCookie === true) {
            client.log('🔐  Unlocking token with credentials.')
            _.loadCookieFromDisk(one,two,function(status){
                if(status === 'success') {
                    callback('success');
                }
                else {
                    client.warn('Getting a fresh cookie instead.')
                    login();
                }
            });
        }
        else {
            login();
        }



        let login = function() {
            request({
                url: 'https://'+FW.HOST+'/homepage.php',
                method: 'GET',
                followRedirect: false
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //client.log('Saving PHPSESSID cookie...');
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
                            //client.log('Saving verf cookie...');
                            _.cookie += '; '+response.headers['set-cookie'][0];
                            client.success('Login successful!');

                            if(saveCookie === true) {
                                client.log('🔏  Encrypting and saving token.');
                                _.saveCookieToDisk(one, two, function(status){
                                    //Doesn't matter what the status is, because .authenticate() did its job.
                                    //Any errors will be printed anyway
                                    callback('success');
                                });
                            }
                            else {
                                callback('success');
                            }
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
            });
        };




    }
    else if(one === undefined || two === undefined || one === null || two === null) {
        client.error('Error with provided credentials.');
    }
    else {
        client.error('Unknown error in auth.authenticate');
    }
};

_.checkLoginStatus = function(callback) {
    //client.log('Checking login status...');
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
                //callback('success');
            }
            else {
                //client.warn('No longer logged in.');
                callback('fail');
            }
        }
        else {
            throw error;
        }
    });
};

_.loadCookieFromDisk = function(username,password,callback) {

    let hash = crypto.createHash('md5').update(username).digest('hex');

    fs.access(hash+'.json', fs.F_OK, function(err){
        if(err) {
            client.error('Couldn\'t access '+hash+'.json');
            callback('fail');
        }
        else {
            //If the file exists
            fs.readFile(hash+'.json', 'utf8', function(err,data) {
                if (err) {
                    client.error('Couldn\'t read from '+hash+'.json');
                    callback('fail');
                }

                //client.log(hash+'.json loaded and ready for decryption.');

                let decipher = crypto.createDecipher(algorithm,password)
                let dec = decipher.update(data,'hex','utf8')
                dec += decipher.final('utf8');
                _.cookie = dec;

                //client.log('Decrypted data from disk. Validating saved cookie with Fluff World.');

                //Intentionally breaking the cookie to attempt refresh (for debugging)
                //_.cookie = 'dickbutt';

                _.checkLoginStatus(function(status){
                    if(status === 'success') {
                        client.success('🔓  Unlocked and validated token!');
                        callback('success');
                    }
                    else {
                        client.error('  Token is no longer valid.');
                        callback('fail');
                    }
                });
            });
        }
    });
};

_.saveCookieToDisk = function(username,password,callback) {

    let hash = crypto.createHash('md5').update(username).digest('hex');

    let cipher = crypto.createCipher(algorithm,password);
    let crypted = cipher.update(_.cookie,'utf8','hex');
    crypted += cipher.final('hex');

    fs.writeFile(hash+'.json', crypted, function(err) {
        if (err) {
            client.error('Couldn\'t write '+hash+'.json to disk.');
            callback('fail');
        }
        //client.success('Saved cookie to disk under '+hash+'.json');
        callback('success');
    });

};

module.exports = _;
