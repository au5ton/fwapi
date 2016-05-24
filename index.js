/*
** fwapi
**
** https://github.com/au5ton/fwapi
**
*/

'use strict';


require('ssl-root-cas/latest').inject()

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
