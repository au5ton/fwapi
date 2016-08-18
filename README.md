# fwapi
npm module for interacting with Fluff World

## NOTICE

Currently, the fwapi has adapted to Fluff World's current state. Fluff World has migrated hosts and is currently only HTTP. Secure connections aren't available yet. v0.3.28 implemented a [temporary fix](https://github.com/au5ton/fwapi/commit/a73232eddfcfcbf36fca58a5e27285b84474b8b5) to continue functionality, but all data sent and received won't be secure and protected. This will be overwritten in v0.4.0 when Fluff World's new host supports HTTPS (secure) connections.

## Installation

`npm install fwapi --save`

To use fwapi.song.getSongLength, fwapi depends on node-ffprobe, which requires [FFmpeg](https://ffmpeg.org/) to be installed and (likely) in your path. To use fwapi.song.getSongLength, you'll need to install FFmpeg (`brew install ffmpeg` on OS X works).

## API plan

### Protocol research

A very important part in figuring out how to dissect Fluff World. See [PROTOCOLS.md](md/PROTOCOLS.md).

### Internal modules
`auth.js` &rarr; methods and things for logging in

`chat.js` &rarr; methods and things for the chat

`constants.js` &rarr; constant values throughout project

`interface.js` &rarr; methods and things present in all modules

`song.js` &rarr; methods and things for the Song of the Day

`torrent.js` &rarr; methods and things for the torrent section

### Development so far

- [X] Authentication framework
- [ ] Basic event-driven chatting
- [X] Torrent section posting
- [ ] Torrent section searching
- [X] SOTD downloading
- [ ] Check all above and to reach a 1.0.0 release
