/*
** fwapi
**
** https://github.com/au5ton/fwapi
**
*/
'use strict';

var request = require('request');
var client = require('au5ton-logger');
var cookie = require('cookie');
var colors = require('colors');
var fs = require('fs');
var readline = require('readline');
var progress = require('progress-stream');
var probe = require('node-ffprobe');
var FW = require('./constants.js');

var _ = require('./interface.js');

_.lastDownloadedSong = '';

_.downloadSong = function(options, callback) {
    let fileName = '';

    let prog;

    request({
        url: 'https://'+FW.HOST+'/song_download.php',
        method: 'GET',
        headers: {
            Cookie: _._cookie
        }
    }).on('response', function(response) {
        //client.log(response.headers['content-length']);
        prog = progress({
            length: parseInt(response.headers['content-length']),
            time: 100
        });

        prog.on('progress', function(progress) {
            readline.clearLine(process.stdout,0);
            readline.cursorTo(process.stdout,0);
            readline.moveCursor(process.stdout,0,-1);
            readline.clearLine(process.stdout,0);
            readline.cursorTo(process.stdout,0);
            readline.moveCursor(process.stdout,0,-1);
            readline.clearLine(process.stdout,0);
            readline.cursorTo(process.stdout,0);
            client.print('Progress: ',(parseInt(progress.percentage*100)/100),'%\n');
            client.print('Runtime: ',progress.runtime,' seconds\n');
            client.print(progress.eta,' seconds remaining');
        });

        prog.on('end', function() {
            client.print('\n');
            _.lastDownloadedSong = fileName;
            callback({status:'success', file: fileName});
        });
        prog.on('error', function(e) {
            client.error(e);
            callback({status:'fail', file: null});
        });

        if(options.file !== undefined && options.file !== null && typeof options.file === 'string') {
            fileName = options.file;
        }
        else {
            //Gets original uploaded file name, provided by Fluff World
            fileName = cookie.parse(response.headers['content-disposition'])['filename'];
        }

        if(options.path !== undefined && options.path !== null && typeof options.path === 'string') {
            if(options.path.charAt(options.path.length-1) !== '/') {
                options.path += '/';
            }
            fileName = options.path + fileName;
        }

        //Safely saves the file
        let recur = function(){
            try {
                //check if file exists
                fs.accessSync(fileName, fs.F_OK);

                //if file does exist, change the name and call recur()
                fileName += crypto.randomBytes(2).toString('hex');
                recur();

            } catch (e) {
                //if file doesn't exist, you good.
                //recursion stack will close.
            }
        };
        recur();
        client.log('Downloading song to '+colors.green(fileName)+' ...\n\n');
        this.pipe(prog).pipe(fs.createWriteStream(fileName));

    });
};

_.getSongLength = function(path, callback) {

    if(callback === undefined) {
        callback = function(){};
    }

    probe(__dirname+path, function(err, probeData) {
        if(err) throw err;
        callback(parseInt(probeData.streams[0]['duration'] * 1000));
    });

};

_.startListening = function(callback) {
    if(callback === undefined) {
        callback = function(){};
    }

    request({
        url: 'https://'+FW.HOST+'/song.php',
        method: 'GET',
        headers: {
            Cookie: _._cookie
        }
    }).on('error', function(e) {
        client.error(e);
    }).on('response', function() {
        client.log(FW.HOST+'/song.php requested');
    });
};

_.redeemPoints = function(callback) {
    if(callback === undefined) {
        callback = function(){};
    }

    request({
        url: 'https://'+FW.HOST+'/scripts/torrent_upload.php',
        method: 'POST',
        form: {
            checktime: 'Redeem Points'
        },
        headers: {
            Cookie: _._cookie
        }
    }, function(error, response, body) {
        let error_text = 'Close window and listen again';
        if(error) {
            client.error(error);
        }
        if(body.indexOf(error_text) >= 0) {
            client.warn('SOTD points redemption failed.');
            callback('fail');
        }
        else {
            client.success('SOTD points redemption successful.');
            callback('success');
        }
    });
};

module.exports = _;
