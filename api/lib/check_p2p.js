const exec = require('child_process').exec;
const util = require('./util').util;
const { url, config } = require('../_config');

var check_p2p_temp = {};
var doing = false;
var requestList = []

function check_p2p(host, port, callback) {

  // null
  if (!host || host.indexOf(".") === -1) {
    callback({
      host: host,
      port: port,
      rows: [],
    });
    return
  }

  // out cache
  callback({
    host: host,
    port: port,
    rows: (check_p2p_temp[host]) ? check_p2p_temp[host].rows : []
  });

  // cache 2-4min
  var cache_time = 120 + Math.ceil(Math.random() * 120);
  if (check_p2p_temp[host] && (new Date().getTime() / 1000) - check_p2p_temp[host]["time"] < cache_time) {
    return;
  } else {
    check_p2p_temp[host] = {
      time: new Date().getTime() / 1000,
      rows: (check_p2p_temp[host]) ? check_p2p_temp[host].rows : []
    }
  }

  requestList.push({ host: host, port: port })
  if (!doing) {
    find();
  }
}

function find() {
  if (!requestList.length) return
  var { host, port } = requestList.shift()
  doing = true;
  var cmdStr = 'docker logs fibos-node --tail 1000 2>&1 | grep -a -i " ' + host + '" | sort -k 2 -b -r | head -n 2';
  console.log("exec grep p2p", host);
  console.time("exec grep p2p " + host)
  exec(cmdStr, function (err, res1) {
    console.timeEnd("exec grep p2p " + host)
    var rows = res1.split("\n");
    rows = rows.slice(0, rows.length - 1)
    // set cache
    check_p2p_temp[host] = {
      time: new Date().getTime() / 1000,
      rows: util.checkNullObj(rows) ? check_p2p_temp[host].rows : rows,
    };
    doing = false;
    if (requestList.length) {
      setTimeout(function () {
        find()
      }, 1000)
    }
  });
}
exports.check_p2p = check_p2p