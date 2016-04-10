var api = require('./index.js');
var client = require('au5ton-logger');

const login = {
    user: 'soot',
    pass: process.argv[2]
};

api.auth.authenticate(login.user, login.pass, function(status){
    //client.log('Cookie: ', api.auth.cookie);

    api.auth.checkLoginStatus(function(status2){
        client.log(status2);
    });

});
