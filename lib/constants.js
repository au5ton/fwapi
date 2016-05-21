/*
** fwapi
**
** https://github.com/au5ton/fwapi
**
*/

//Credit: http://stackoverflow.com/a/26227660

module.exports.HOST = 'fluff.world';
module.exports.LIVE_CHECK = 'tutorials/sandboxed.php';
module.exports.ENV_APP_DATA = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local');
module.exports.APP_PREFS = ENV_APP_DATA+'/net.austinj.fwapi/';
