# fwapi
npm module for interacting with Fluff World

## Installation

`npm install fwapi --save`

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
