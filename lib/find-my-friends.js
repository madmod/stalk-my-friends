'use strict';

var request = require('request');
var util = require('util');


var findmyfriends = {

  init: function (credentials, callback) {
    if (!credentials)
      return callback(TypeError('Missing required argument "credentials".'));

    var newLogin = !findmyfriends.jar;
    if (newLogin) findmyfriends.jar = request.jar();

    findmyfriends.request = request.defaults({
      jar: findmyfriends.jar,
      headers: {
        'Origin': 'https://www.icloud.com'
      }
    });

    if (newLogin) {
      findmyfriends.login(credentials, function (err, res, body) {
        return callback(err, res, body);
      });
    }
    else {
      findmyfriends.checkSession(function (err, res, body) {
        if (err) {
          // session is dead, start new
          findmyfriends.jar = null;
          findmyfriends.jar = request.jar();

          findmyfriends.login(credentials, function (err, res, body) {
            return callback(err, res, body);
          });
        } else {
          console.log('reusing session');
          return callback(err, res, body);
        }
      });
    }
  },

  login: function (credentials, callback) {
    if (!credentials.email || !credentials.password)
      return callback(TypeError('Argument "credentials" missing required keys "email" and "password".'));

    var options = {
      url: 'https://setup.icloud.com/setup/ws/1/login',
      json: {
        'apple_id': credentials.email,
        'password': credentials.password,
        'extended_login': true
      }
    };

    findmyfriends.request.post(options, function (error, response, body) {
      if (!response || response.statusCode != 200) {
        console.error('Login failed', response);
        return callback(Error('Login Error'));
      }

      findmyfriends.onLogin(body, function (err, resp, body) {
        return callback(err, resp, body);
      });
    });
  },

  checkSession: function (callback) {
    var options = {
      url: 'https://setup.icloud.com/setup/ws/1/validate',
    };

    findmyfriends.request.post(options, function (error, response, body) {
      if (!response || response.statusCode != 200) {
        return callback('Could not refresh session');
      }

      findmyfriends.onLogin(body, function (err, resp, body) {
        return callback(err, resp, body);
      });
    });
  },

  onLogin: function (body, callback) {
    console.log('on login body', body);

    if (body.hasOwnProperty('webservices') && body.webservices.hasOwnProperty('findme')) {
      findmyfriends.base_path = body.webservices.findme.url;

      console.log('findmyfriends.base_path', findmyfriends.base_path);

      /*
      options = {
        url: findmyfriends.base_path + '/fmipservice/client/web/initClient',
        json: {
          'clientContext': {
            'appName': 'iCloud Find (Web)',
            'appVersion': '2.0',
            'timezone': 'US/Eastern',
            'inactiveTime': 3571,
            'apiVersion': '3.0',
            'fmly': true
          }
        }
      };

      findmyfriends.request.post(options, callback);
      */
      callback();
    }
    else {
      return callback(Error('Login response missing findmyfriends base path.'));
    }
  }

/*
  getDevices: function (callback) {
    findmyfriends.init(function (error, response, body) {
      if (!response || response.statusCode != 200) {
        return callback(error);
      }

      var devices = [];

      // Retrieve each device on the account
      body.content.forEach(function (device) {
        devices.push({
          id: device.id,
          name: device.name,
          deviceModel: device.deviceModel,
          modelDisplayName: device.modelDisplayName,
          deviceDisplayName: device.deviceDisplayName,
          batteryLevel: device.batteryLevel,
          isLocating: device.isLocating,
          lostModeCapable: device.lostModeCapable,
          location: device.location
        });
      });

      callback(error, devices);
    });
  }
*/

};


module.exports = findmyfriends.init;


