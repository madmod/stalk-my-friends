'use strict';


var uuid = require('node-uuid');
var https = require('https');


var iCloud = function iCloud(appleId, password, callback) {

  this.urls = {
    "version" : "https://www.icloud.com/system/version.json",
    "validate": "/setup/ws/1/validate?clientBuildNumber={0}&clientId={1}",
    "login": "/setup/ws/1/login?clientBuildNumber={0}&clientId={1}"
  }

  this.appleId = appleId;
  this.password = password;

  this.clientBuildNumber = '1P24';
  this.clientId = uuid.v1().toString().toUpperCase();

  // console.log('Generated UUID: ' + this.clientId);

  this.cookie = null;
  this.instance = null;

  return this;
}


iCloud.prototype = {
  getLocations: function (callback) {
    var me = this;

    var endpoint = this.urls.login
    .replace('{0}', this.clientBuildNumber)
    .replace('{1}', this.clientId);

    // console.log(endpoint);

    var options = {
      host: "p12-setup.icloud.com",
      path: endpoint,
      method: 'POST',
      headers: {
        'Origin': 'https://www.icloud.com',
        'Referer': 'https://www.icloud.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36'
      }
    };

    var data = JSON.stringify({
      apple_id: this.appleId,
      password: this.password,
      extended_login: false
    });

    var request = https.request(options, function(res) {

      if (res.headers['set-cookie']) me.cookie = res.headers['set-cookie'];

      var buffer = '';

      res.on('data', function(data) {
        buffer += data;
      });

      res.on('end', function() {

        me.instance = JSON.parse(buffer);

        var dsid = me.instance.dsInfo.dsid;
        var getFmfUrl = '/fmipservice/client/fmfWeb/initClient?clientBuildNumber={1}&clientId={2}&dsid={3}'
        .replace('{1}', me.clientBuildNumber)
        .replace('{2}', me.clientId)
        .replace('{3}', dsid); // &id={4}

        console.log(getFmfUrl);

        console.log(me.instance.webservices)
        var options2 = {
          host: me.instance.webservices.fmf.url.replace('https://', '').replace(':443', ''),
          path: getFmfUrl,
          method: 'POST',
          headers: {
            'Origin': 'https://www.icloud.com',
            'Referer': 'https://www.icloud.com',
            'Cookie': me.cookie.join('; '),
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36'
          }
        };

        var req2 = https.request(options2, function(res) {

          var buf2 = '';
          res.on('data', function(data) {
            buf2 += data;
          });

          res.on('end', function() {
            console.log(buf2)
            var data = JSON.parse(buf2);
            console.log(JSON.stringify(data, null, 2));
            callback(null, data);
          });
        });

        req2.write('{"dataContext":null,"serverContext":null,"clientContext":{"productType":"fmfWeb","appVersion":"1.0","contextApp":"com.icloud.web.fmf","userInactivityTimeInMS":537,"windowInFocus":false,"windowVisible":true,"mapkitAvailable":true,"tileServer":"Apple"}}');
        req2.end();

      });
    });

    request.write(data);

    request.end();
  }
};


module.exports = iCloud;

