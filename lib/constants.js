/*
** fwapi
**
** https://github.com/au5ton/fwapi
**
*/

//Credit: http://stackoverflow.com/a/26227660

module.exports.HOST = 'https://fluff.world';
module.exports.LIVE_CHECK = 'tutorials/sandboxed.php';
module.exports.ENV_APP_DATA = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME);
module.exports.APP_PREFS = module.exports.ENV_APP_DATA +'/.net.austinj.fwapi';
