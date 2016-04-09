# fwapi protocols
How HTTP'ing with fluff world works


## Authentication

### `GET homepage.php`
#### Situation 1
##### Request
Empty, cookie is null
##### Reponse
Status: 302;
Set-Cookie header contains newly generated PHPSESSID (no verf cookie included):
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
Cookie contains invalid `PHPSESSID` or `verf` cookies

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
