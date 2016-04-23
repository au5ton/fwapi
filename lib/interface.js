/*
** fwapi
**
** https://github.com/au5ton/fwapi
**
*/

var _ = {};

_._cookie = null;
_.setCookie = function(c) {
    _._cookie = c;
};
_.getCookie = function() {
    return _._cookie;
}

module.exports = _;
