/*
** fwapi
**
** https://github.com/au5ton/fwapi
**
*/
'use strict';

var request = require('request');
var client = require('au5ton-logger');
var colors = require('colors')
var FW = require('./constants.js');

var _ = require('./interface.js');
_.Ledger = {
    'Video - Movies': 11,
    'Video - TV Shows': 12,
    'Video - General': 10,
    'Audio - Music': 21,
    'Audio - Audiobooks': 22,
    'Audio - General': 20,
    'Applications - Windows': 31,
    'Applications - Mac': 32,
    'Apps - iOS': 33,
    'Apps - Android': 34,
    'Games - PC': 41,
    'Games - Mac': 42,
    'Games - Playstation': 43,
    'Games - Xbox': 44,
    'Games - Wii': 45,
    'Games - Handheld': 46,
    'Games - iOS': 47,
    'Games - Android': 48,
    'Games - Retro': 49,
    'E-Books': 51,
    'General Documents': 52
};

//Torrent constructor
_.Torrent = function(obj) {
    this.name = obj.name;
    this.magnetLink = obj.magnetLink;
    this.subcategory = obj.subcategory;
    this.categoryString = obj.categoryString;

    if( (obj.subcategory === null || obj.subcategory === undefined) && (this.categoryString !== null && this.categoryString !== undefined)) {
        //Transform categoryString into subcategory

    }
}

_.locallyValidateTorrent = function(torrent, callback) {
    if(typeof callback !== 'function') {
        callback = function(){};
    }
    let valid = true;

    //Check if name is too long to be normal
    if(torrent.name.length >= 100) {
        client.warn('Torrent named \''+torrent.name.substring(0,32)+'...\' has an abnormally long name.\n');
        valid = false;
    }

    if(typeof torrent.subcategory === 'undefined' || torrent.subcategory === null) {
        client.warn('Torrent named \''+torrent.name.substring(0,32)+'...\' has an undefined or invalid subcategory.');

        let temp = false;
        for(let catName in _.Ledger) {
            if(torrent.categoryString.toLowerCase() === catName.toLowerCase()) {
                temp = true;
            }
        }
        if(temp === false) {
            client.warn('Torrent named \''+torrent.name.substring(0,32)+'...\' has an invalid categoryString.');
            valid = false;
        }
    }
    else {
        if(!(torrent.subcategory.length === 3 && /[1-5]/.test(torrent.subcategory.toString().charAt(0)))) {
            client.warn('Torrent named \''+torrent.name.substring(0,32)+'...\' has an invalid subcategory.');
            valid = false;
        }
    }

    if(valid === false) {
        client.error('Torrent named \''+torrent.name.substring(0,32)+'...\' is therefor invalid.');
        callback('fail');
    }
    else {
        client.success('Torrent named \''+torrent.name.substring(0,32)+'...\' validated.');
        callback('success');
    }

};

_.postTorrent = function(torrent, callback) {
    request({
        url: 'https://'+FW.HOST+'/scripts/torrent_upload.php',
        method: 'POST',
        form: {
            tor_name: torrent.name,
            tor_hash: torrent.magnetLink,
            tor_cat: _.categoryMatcher(torrent)
        },
        headers: {
            Cookie: _._cookie
        }
    }, function(error, response, body) {
        if(error) {
            client.error(error);
        }
        if(!error && body === 'success') {
            client.success('Torrent \''+torrent.name+'\' was posted.')
            callback('success');
        }
        else {
            client.error('Torrent \''+torrent.name.substring(0,32)+'\' could not be posted because:\n', body);
            callback('fail');
        }
    });

};

_.categoryMatcher = function(torrent) {

    if(torrent.subcategory.charAt(0) === '1') {
        if(torrent.subcategory.charAt(2) === '1') {
            return _.Ledger['Audio - Music'];
        }
        else if(torrent.subcategory.charAt(2) === '2') {
            return _.Ledger['Audio - Audiobooks'];
        }
        else {
            return _.Ledger['Audio - General'];
        }
    }
    else if(torrent.subcategory.charAt(0) === '2'){
        if(torrent.subcategory.charAt(2) === '1' || torrent.subcategory.charAt(2) === '2' || torrent.subcategory.charAt(2) === '7') {
            return _.Ledger['Video - Movies'];
        }
        else if(torrent.subcategory.charAt(2) === '5' || torrent.subcategory.charAt(2) === '8') {
            return _.Ledger['Video - TV Shows'];
        }
        else {
            return _.Ledger['Video - General'];
        }
    }
    else if(torrent.subcategory.charAt(0) === '3'){
        if(torrent.subcategory.charAt(2) === '1') {
            return _.Ledger['Applications - Windows'];
        }
        else if(torrent.subcategory.charAt(2) === '2') {
            return _.Ledger['Applications - Mac'];
        }
        else if(torrent.subcategory.charAt(2) === '5') {
            return _.Ledger['Apps - iOS'];
        }
        else if(torrent.subcategory.charAt(2) === '6') {
            return _.Ledger['Apps - Android'];
        }
        else {
            return _.Ledger['General Documents'];
        }
    }
    else if(torrent.subcategory.charAt(0) === '4'){
        if(torrent.subcategory.charAt(2) === '1') {
            return _.Ledger['Games - PC'];
        }
        else if(torrent.subcategory.charAt(2) === '2') {
            return _.Ledger['Games - Mac'];
        }
        else if(torrent.subcategory.charAt(2) === '3') {
            return _.Ledger['Games - Playstation'];
        }
        else if(torrent.subcategory.charAt(2) === '4') {
            return _.Ledger['Games - Xbox'];
        }
        else if(torrent.subcategory.charAt(2) === '5') {
            return _.Ledger['Games - Wii'];
        }
        else if(torrent.subcategory.charAt(2) === '6') {
            return _.Ledger['Games - Handheld'];
        }
        else if(torrent.subcategory.charAt(2) === '7') {
            return _.Ledger['Games - iOS'];
        }
        else if(torrent.subcategory.charAt(2) === '8') {
            return _.Ledger['Games - Android'];
        }
        else {
            return _.Ledger['General Documents'];
        }
    }
    else if(torrent.subcategory.charAt(0) === '5'){
        if(torrent.subcategory.charAt(2) === '1' || torrent.subcategory.charAt(2) === '2' || torrent.subcategory.charAt(2) === '5' || torrent.subcategory.charAt(2) === '6') {
            return _.Ledger['Video - Movies'];
        }
        else {
            return _.Ledger['Video - General'];
        }
    }
    else if(torrent.subcateg === '601'){
        return _.Ledger['E-Books'];
    }
    else {
        return _.Ledger['General Documents'];
    }
};

module.exports = _;
