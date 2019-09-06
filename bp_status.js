const request = require('request');

const util = require('./util').util;
const { url } = require('./_config');


var status = {};
var status_number = {};
var bpsObj = {};
var get_info = { head_block_num: "", head_block_time: "", head_block_producer: "" };
var bp_status_refresh_time = new Date();
var start_time = new Date().getTime();

getBPs();
getLog();

// 取得出块记录
function getLog() {

  setTimeout(function () {
    getLog()
  }, 1000)

  request.get(url.rpc.get_info, function (err, response, body) {

    if (err) return
    body = JSON.parse(body)
    var bpName = body.head_block_producer
    bpsObj[bpName] = {
      number: body.head_block_num,
      date: body.head_block_time
    }
    get_info = { head_block_num: body.head_block_num, head_block_time: body.head_block_time, head_block_producer: body.head_block_producer };

    bp_status_refresh_time = new Date();

    var bpsArray = [];
    for (var bpName in bpsObj) {
      bpsArray.push({
        name: bpName,
        number: bpsObj[bpName].number,
        date: bpsObj[bpName].date,
      })
    }
    bpsArray.sort(util.compare_sort("number"));
    bpsArray = bpsArray.slice(0, 21)
    // bpsObj = {}
    for (var i in bpsArray) {
      bpsObj[bpsArray[i].name] = {
        number: bpsArray[i].number,
        date: bpsArray[i].date,
      }
    }

    status = {}
    status_number = []
    for (var bpName in bpsObj) {
      status[bpName] = get_info.head_block_num - bpsObj[bpName].number > 504 ? 'offline' : 'online',
        status_number.push({
          bpname: bpName,
          number: bpsObj[bpName].number,
          date: bpsObj[bpName].date,
        })
    }
    status_number.sort(util.compare_sort("bpname"));

  })
}

// 取得BP 21节点
function getBPs() {
  request.post(url.rpc.get_table_rows, {
    json: {
      "scope": "eosio",
      "code": "eosio",
      "table": "producers",
      "json": "true",
      "limit": 21,
      "key_type": "float64",
      "index_position": 2,
    }
  }, function (err, response, body) {
    if (!err && body && body.rows && body.rows.length == 21) {
      var list = body.rows;
      for (var i = 0; i < list.length; i++) {
        if (list[i] && list[i].owner) {
          var bpName = list[i].owner;
          bpsObj[bpName] = {
            number: (bpsObj[bpName] && bpsObj[bpName]['number']) ? bpsObj[bpName]['number'] : 0,
            date: (bpsObj[bpName] && bpsObj[bpName]['date']) ? bpsObj[bpName]['date'] : 0,
          }
        }
      }
    }
  });

  setTimeout(function () {
    getBPs()
  }, 6000)
}


function bp_status() {

  // 启动前三分钟不显示结果
  if (new Date().getTime() - start_time < 3 * 60 * 1000) {
    return {
      _rows: status,
      _rows2: status_number,
      rows: {},
      rows2: [],
      head_block_num: get_info.head_block_num,
      head_block_time: get_info.head_block_time,
      head_block_producer: get_info.head_block_producer,
      bp_status_refresh_time: bp_status_refresh_time,
    };
  }

  return {
    rows: status,
    rows2: status_number,
    head_block_num: get_info.head_block_num,
    head_block_time: get_info.head_block_time,
    head_block_producer: get_info.head_block_producer,
    bp_status_refresh_time: bp_status_refresh_time,
  };
}

exports.bp_status = bp_status