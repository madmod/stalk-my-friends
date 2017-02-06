# stalk-my-friends [![Build Status](https://travis-ci.org/madmod/stalk-my-friends.svg?branch=master)](https://travis-ci.org/madmod/stalk-my-friends)

Unofficial Apple Find My Friends API client.


## Install

```
$ npm install --save stalk-my-friends
```


## CLI

Copy `config.js.example` to `config.js` and add iCloud credentials.

```
node ./cli.js
```

## TODO

- Prevent Apple from thinking this is a "new device" every time it is used so we don't get a notification email.
- Make a stable API and document it.
- The API is a total mess with nonsense and redundancy everywhere. Clean it up.
- Abstract away the apple specific response format into something much simpler and maybe find some kind of standard format for location data.
- Cache logins and handle session renewal with the unfinished code in `lib/find-my-friends.js`.
- Properly separate `lib/icloud.js` from `lib/find-my-friends.js`.


## License

MIT © [madmod](http://johnathanwells.com)


