const request = require('request');
const jsdom = require('jsdom');
const $ = require('jquery')(new jsdom.JSDOM().window);
const url = "http://ghost.bp.fo/ghost/"

let uri = ""

async function last_ghost() {
  const response = await doRequest(url);
  uri = $(response).find("a:last").attr("href")
  return url + uri
}

function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}


exports.last_ghost = last_ghost