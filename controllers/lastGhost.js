const axios = require('axios');
const jsdom = require('jsdom');
const $ = require('jquery')(new jsdom.JSDOM().window);
const url = "http://ghost.bp.fo/ghost/"

let uri = ""

async function lastGhost() {
  const { data } = await axios.get(url);
  uri = $(data).find("a:last").attr("href")
  return url + uri
}

module.exports = lastGhost