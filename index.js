/*
** fwapi
**
** https://github.com/au5ton/fwapi
**
*/

'use strict';


require('ssl-root-cas/latest')
.addFile(__dirname + '/ssl/isrgrootx1.pem')
.addFile(__dirname + '/ssl/lets-encrypt-x1-cross-signed.pem')
.addFile(__dirname + '/ssl/lets-encrypt-x2-cross-signed.pem')
.addFile(__dirname + '/ssl/lets-encrypt-x3-cross-signed.pem')
.addFile(__dirname + '/ssl/lets-encrypt-x4-cross-signed.pem')
.inject();

var fs = require('fs');

module.exports.auth = require('./lib/auth.js');
module.exports.chat = require('./lib/chat.js');
module.exports.torrent = require('./lib/torrent.js');
module.exports.song = require('./lib/song.js');
module.exports.constants = require('./lib/constants.js');

//Creates common preferences folder
try {
    fs.mkdirSync(module.exports.constants.APP_PREFS);
} catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
}
