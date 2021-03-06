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
var mp3Duration = require('mp3-duration');
var path = require('path');
var crypto = require('crypto');
var FW = require('./constants.js');

var _ = require('./interface.js');

_.lastDownloadedSong = '';

_.downloadSong = function(options, callback) {
    let fileName = '';

    let prog;

    request({
        url: FW.HOST+'/song_download.php',
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

            if(response.headers['content-disposition'] === undefined) {
                //There is no SOTD today
                client.error('There is no SOTD today.');
                callback({status:'fail', file: null});
            }
            else {
                //Gets original uploaded file name, provided by Fluff World
                fileName = cookie.parse(response.headers['content-disposition'])['filename'];
                let d = new Date();
                fileName = (d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()) + ' ' + fileName;
            }
        }

        if(options.path !== undefined && options.path !== null && typeof options.path === 'string') {
            if(options.path.charAt(options.path.length-1) !== '/') {
                options.path += '/';
            }
            fileName = options.path + fileName;
        }

        try {
            fs.mkdirSync(options.path);
        }
        catch(err) {
            //Folder probably already exists
            //client.error('Given path: ', options.path);
            //client.error('Error with mkdir sotd folder: ', err);
        }

        //Safely saves the file
        let recur = function(){
            try {
                fs.accessSync(fileName, fs.F_OK);

                //client.log('Exists, attempting to change: ', fileName);
                //Changes something like /Users/austin/song.mp3 into /Users/austin/song5c1e.mp3
                fileName = path.dirname(fileName)+'/'+path.basename(fileName, path.extname(path.basename(fileName)))+crypto.randomBytes(2).toString('hex')+path.extname(path.basename(fileName));
                recur();
                //if file does exist, change the name and call recur()
            }
            catch(err) {
                //fileName doesn't exist, and the new fileName is unique and safe
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

    mp3Duration(path, function(err, duration){
        if(err)throw err;
        callback(parseInt(duration * 1000));
    });

};

_.startListening = function(callback) {
    if(callback === undefined) {
        callback = function(){};
    }

    request({
        url: FW.HOST+'/song.php',
        method: 'GET',
        headers: {
            Cookie: _._cookie
        }
    }).on('error', function(e) {
        client.error(e);
        callback('fail');
    }).on('response', function() {
        client.log(FW.HOST+'/song.php requested');
        callback('success');
    });
};

_.redeemPoints = function(callback) {
    if(callback === undefined) {
        callback = function(){};
    }

    request({
        url: FW.HOST+'/song.php',
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
