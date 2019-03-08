const request = require('request');

function json2jsonp(url, call, callback) {
  request.get(url, { timeout: 1000 }, function (err, response, body) {
    callback(
      call
        ? call + "(" + body + ")"
        : body
    )
  })
};

exports.json2jsonp = json2jsonp;