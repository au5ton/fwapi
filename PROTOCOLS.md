# fwapi protocols
How HTTP'ing with fluff world works


## Authentication

### `GET homepage.php`
#### Situation 1
##### Request
Empty, cookie is null
##### Reponse
Status: 302;
Set-Cookie header contains newly generated `PHPSESSID` (no `verf` cookie included):
```
PHPSESSID=je6p84b8bff2ud56u22ajs7j96; path=/
```

#### Situation 2
##### Request
Cookie contains valid `PHPSESSID` and `verf` cookies
##### Reponse
Status: 302;
Page directs to home.php (Location: home.php)

#### Situation 3
##### Request
Cookie contains invalid or expired `PHPSESSID` or `verf` cookies

##### Reponse
Status: 302;
Page directs to index.php (Location: index.php)

---

### `POST scripts/login_check.php`
#### Form data
> fw_u_n &rarr; fluff world username

> fw_p_w &rarr; fluff world password

### Situation 1
#### Request
Wrong credentials in form data
#### Reponse
Status: 401

### Situation 2
#### Request
Correct credentials in form data
#### Reponse
Status: 200;
Set-Cookie header contains valid `verf` cookie and others like the following;
```
verf=3auu1231a3fb5a7a90a45fba3d20dd8j; expires=Sun, 10-Apr-2016 02:56:21 GMT; Max-Age=86400; path=/
```
Successful login pair generated: `PHPSESSID` and `verf` must be included in authenticated requests;

### Situation 3
#### Request
Too many erroneous login attempts
#### Reponse
Status: 418;
Congratulations, you've been autobanned for bruteforcing the login system;

---

## Torrent section

### `POST scripts/torrent_upload.php`
#### Form data
> tor_name &rarr; torrent name

> tor_hash &rarr; torrent magnet link

> tor_cat &rarr; torrent category (see category key)

### Situation 1
#### Request
Torrent name is < 10 characters
#### Reponse
Status: 200
Error;
"Torrent Name too short." is the response body

### Situation 2
#### Request
Magnet link is invalid
#### Reponse
Status: 200
Error;
"Invalid link." is the response body

### Situation 3
#### Request
Category not defined
#### Reponse
Status: 200
Error;
"Select a category." is the response body

### Situation 4
#### Request
Valid torrent
#### Reponse
Error;
"The torrent already exists." is the response body

### Situation 5
#### Request
Valid torrent
#### Reponse
Error;
"The torrent exists in the old torrent section." is the response body

### Situation 6
#### Request
Valid torrent
#### Reponse
"success" is the response body

### `GET scripts/torrent_pages.php`
#### Query string
> id &rarr; ???

#### Situation 1
##### Request
???
##### Reponse
???

### Category key

```javascript
//Fluff World key
var Ledger = {
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

```
