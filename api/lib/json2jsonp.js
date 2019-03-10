const request = require('request');

var json2jsonp_temp = {};

function json2jsonp(url, call, callback) {

  if (
    json2jsonp_temp[url]
    && json2jsonp_temp[url].time + 20 * 1000 > new Date().getTime()
  ) {
    console.log("json2jsonp temp", url)
    const body = json2jsonp_temp[url].payload
    callback(
      call
        ? call + "(" + body + ")"
        : body
    )
    return
  }

  request.get(url, { timeout: 1000 }, function (err, response, body) {

    console.log("json2jsonp get", url)
    json2jsonp_temp[url] = {
      time: new Date().getTime(),
      payload: body
    }

    callback(
      call
        ? call + "(" + body + ")"
        : body
    )

  })
};

exports.json2jsonp = json2jsonp;