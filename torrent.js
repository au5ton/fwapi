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

var _ = {};
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
_.Torrent = function(name, magnetLink, subcategory, categoryString) {
    this.name = name;
    this.magnetLink = magnetLink;
    this.subcategory = subcategory;
    this.categoryString = categoryString;
}

_.validateTorrent = function(torrent, callback) {
    if(typeof callback !== 'function') {
        callback = function(){};
    }
    let valid = true;

    //Check if name is too long to be normal
    if(torrent.name.length >= 100) {
        client.warn('Torrent named \''+torrent.name.substring(0,32)+'...\' has an abnormally long name.\n');
        valid = false;
    }

    //Undefined or invalid anyway
    if(typeof torrent.subcategory !== 'number') {
        client.warn('Torrent named \''+torrent.name.substring(0,32)+'...\' has an undefined or invalid subcategory.');

        //TODO: If torrent.categoryString isn't a key in _.Ledger, log warning and valid=false

    }
    else {
        //TODO: If torrent.subcategory is valid from TPB
    }
};

_.postTorrent = function(torrent, callback) {
    //
};

_.categoryMatcher = function(torrent) {



    if(torrent.subcategory.id.charAt(0) === '1') {
        if(torrent.subcategory.id.charAt(2) === '1') {
            return _.Ledger['Audio - Music'];
        }
        else if(torrent.subcategory.id.charAt(2) === '2') {
            return _.Ledger['Audio - Audiobooks'];
        }
        else {
            return _.Ledger['Audio - General'];
        }
    }
    else if(torrent.subcategory.id.charAt(0) === '2'){
        if(torrent.subcategory.id.charAt(2) === '1' || torrent.subcategory.id.charAt(2) === '2' || torrent.subcategory.id.charAt(2) === '7') {
            return _.Ledger['Video - Movies'];
        }
        else if(torrent.subcategory.id.charAt(2) === '5' || torrent.subcategory.id.charAt(2) === '8') {
            return _.Ledger['Video - TV Shows'];
        }
        else {
            return _.Ledger['Video - General'];
        }
    }
    else if(torrent.subcategory.id.charAt(0) === '3'){
        if(torrent.subcategory.id.charAt(2) === '1') {
            return _.Ledger['Applications - Windows'];
        }
        else if(torrent.subcategory.id.charAt(2) === '2') {
            return _.Ledger['Applications - Mac'];
        }
        else if(torrent.subcategory.id.charAt(2) === '5') {
            return _.Ledger['Apps - iOS'];
        }
        else if(torrent.subcategory.id.charAt(2) === '6') {
            return _.Ledger['Apps - Android'];
        }
        else {
            return _.Ledger['General Documents'];
        }
    }
    else if(torrent.subcategory.id.charAt(0) === '4'){
        if(torrent.subcategory.id.charAt(2) === '1') {
            return _.Ledger['Games - PC'];
        }
        else if(torrent.subcategory.id.charAt(2) === '2') {
            return _.Ledger['Games - Mac'];
        }
        else if(torrent.subcategory.id.charAt(2) === '3') {
            return _.Ledger['Games - Playstation'];
        }
        else if(torrent.subcategory.id.charAt(2) === '4') {
            return _.Ledger['Games - Xbox'];
        }
        else if(torrent.subcategory.id.charAt(2) === '5') {
            return _.Ledger['Games - Wii'];
        }
        else if(torrent.subcategory.id.charAt(2) === '6') {
            return _.Ledger['Games - Handheld'];
        }
        else if(torrent.subcategory.id.charAt(2) === '7') {
            return _.Ledger['Games - iOS'];
        }
        else if(torrent.subcategory.id.charAt(2) === '8') {
            return _.Ledger['Games - Android'];
        }
        else {
            return _.Ledger['General Documents'];
        }
    }
    else if(torrent.subcategory.id.charAt(0) === '5'){
        if(torrent.subcategory.id.charAt(2) === '1' || torrent.subcategory.id.charAt(2) === '2' || torrent.subcategory.id.charAt(2) === '5' || torrent.subcategory.id.charAt(2) === '6') {
            return Ledger['Video - Movies'];
        }
        else {
            return Ledger['Video - General'];
        }
    }
    else if(torrent.subcategory.id === '601'){
        return Ledger['E-Books'];
    }
    else {
        return Ledger['General Documents'];
    }
};

module.exports = _;
