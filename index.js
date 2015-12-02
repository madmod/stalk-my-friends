'use strict';

var config = require('./config');

var express = require('express');
var app = express();


var iCloud = require('./lib/icloud.js');


app.get('/locations', function(req, res){
  console.log(iCloud)
  var cloud = new iCloud(config.icloud.email, config.icloud.password);

  var locations = cloud.getLocations(function (err, locations) {
    console.log(err, locations)
    res.json(locations);
    res.send();
  });

  console.log('result', locations)
});


app.listen(3001);


