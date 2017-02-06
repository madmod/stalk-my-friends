'use strict';

var config = require('./config.js');
var iCloud = require('./lib/icloud.js');


var client = new iCloud(config.icloud.email, config.icloud.password);

client.getLocations(function () {
  console.log('done', arguments)
});


