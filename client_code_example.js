'use strict';

var api = require('./index.js');
var client = require('au5ton-logger');

const login = {
    user: 'soot',
    pass: process.argv[2]
};

api.auth.authenticate(login.user, login.pass, function(){
    api.auth.checkLoginStatus(function(status){
        if(status === 'success') {
            api.torrent.setCookie(api.auth.cookie);

            //Interact with the site however you want to
            let t = new api.torrent.Torrent({
                name: 'Cops S28E30 720p HDTV x265-KRAVE',
                magnetLink: 'magnet:?xt=urn:btih:1e06d25a8706ed3ffdb80c5b8c0dcd22508baf1f&dn=Cops+S28E30+720p+HDTV+x265-KRAVE&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969',
                subcategory: '208'
            });
            api.torrent.locallyValidateTorrent(t, function(status) {
                if(status === 'success') {
                    api.torrent.postTorrent(t, function(status) {
                        client.success('Done.');
                    });
                }
            });


        }
    });

});
