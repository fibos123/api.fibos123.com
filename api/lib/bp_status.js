const fs = require('fs');
const http = require('http');
const request = require('request');
const exec = require('child_process').exec;

const util = require('./util').util;
const {url, config} = require('../_config');

var status = {};
var status_number = {};
var status_tmp = {};
var lines = [];
var bps = [];
var last_status = {}
var get_info = {head_block_num: "", head_block_time: "", head_block_producer: ""};
var bp_status_refresh_time = new Date();
var fibos_log_file = config.log_file;
// var log_mtime = 0;
// var bp_status_log_file = config.bp_status_log_file;
var bp_status_tmp_file = config.bp_status_tmp_file;
var bp_status_log_birthtime = "2018-09-06T12:21:56.985Z";
var now_time = new Date;
// var bp_status_change_logs = [];
var date_cache = {};
var start_time = new Date().getTime();

last_status = (fs.existsSync(bp_status_tmp_file)) ? JSON.parse(fs.readFileSync(bp_status_tmp_file, 'utf8')) : {};

getBPs();
getLog();
// bp_status_change_logs = getBpStatusChangeLogs();

setInterval(function (){
	getBPs()
}, 6000);
setInterval(function (){
	getLog();
}, 1000);
setInterval(function (){
	now_time = new Date();
}, 500);

// 取得出块记录
function getLog() {
	// #1708075 @ 2018-09-07T13:16:43.000 signed by liuqiangdong [
	var re = new RegExp(/#(.*)\s@\s(.*)\ssigned\sby\s(.*)\s\[/g);

	// var cmdStr = 'tail -504 ' + fibos_log_file; // 一个节点生产12块 * 21个节点 * 2轮，12 * 21 * 3 = 756
	var cmdStr = 'docker logs fibos-node --tail 756 2>&1'
	// console.log("exec cmdStr");
	exec(cmdStr, function (err, res) {
		lines = res.split("\n");
	});

	var online = {};
	var offline = [];

	status = status_tmp;
	var status_number_tmp = {};

	for (var i = 0; i < lines.length; i++) {
		var res = re.exec(lines[i]);
		if (!util.checkNullObj(res)) {
			var bpname = res[3];
			if (bps.indexOf(bpname) !== -1) {
				online[bpname] = 1;
				status_number_tmp[bpname] = {
					bpname: bpname,
					number: res[1],
					date: res[2] + "Z",
				};
				date_cache[bpname] = {
					bpname: bpname,
					number: res[1],
					date: res[2] + "Z",
				}
				status[bpname] = "online";
			}
			// log_mtime = res[2];
			get_info = {head_block_num: res[1], head_block_time: res[2], head_block_producer: res[3]};
		}
	}

	// offline
	for (var i = 0; i < bps.length; i++) {
		if ("undefined" === typeof online[bps[i]]) {
			var bpname = bps[i];
			offline.push(bpname);
			status[bpname] = "offline";
			status_number_tmp[bpname] = {
				bpname: bpname,
				number: 0,
				date: 0,
			}
			if (!util.checkNullObj(date_cache[bpname])) {
				status_number_tmp[bpname] = {
					bpname: bpname,
					number: date_cache[bpname].number,
					date: date_cache[bpname].date,
				}
			}
		}
	}

	status_number = [];
	for (var i in status_number_tmp) {
		status_number.push(status_number_tmp[i])
	}
	status_number.sort(util.compare_sort("bpname"));

	// diff
	var diffs = [];
	var date = new Date();

	// console.log(status, last_status)
	if (!util.checkNullObj(status) && !util.checkNullObj(last_status)) {
		// check difff ( in21 )
		for (var bp in last_status) {
			if (last_status[bp] != status[bp]) {
				diffs.push(JSON.stringify({
					date: date,
					bp: bp,
					from: last_status[bp],
					to: status[bp] || "over21"
				}));
			}
		}
		// check diff ( over21 to in21 )
		for (var bp in status) {
			if (!last_status[bp]) {
				diffs.push(JSON.stringify({
					date: date,
					bp: bp,
					from: "over21",
					to: status[bp]
				}));
			}
		}
	}
	last_status = util.copy(status);

	if (diffs.length){
		console.log("diffs", diffs)
		// 启动前三分钟不写入记录
		// if (new Date().getTime() - start_time > 3*60*1000) {
		// 	fs.appendFile(bp_status_log_file, diffs.join("\r\n") + "\r\n", function (err) {
		// 		bp_status_change_logs = getBpStatusChangeLogs();
		// 	});
		// }
		fs.writeFile(bp_status_tmp_file, JSON.stringify(status), function(err) {
		});
		// date_cache = {};
	}

	bp_status_refresh_time = new Date();

	return status;
}

// 取得BP 21节点
function getBPs (err, res) {
	request.post(url.rpc.get_table_rows, {
	            json: {
	            		"scope": "eosio",
	            		"code":  "eosio",
	                    "table": "producers",
	                    "json":  "true",
	                    "limit": 21,
	                    "key_type": "float64",
	                    "index_position": 2,
	            }
	}, function (err, response, body) {
		// console.log(url.rpc.endpoint, url.rpc.get_table_rows, err, body);
		if (!err && body && body.rows && body.rows.length == 21) {
			var list = body.rows;
			bps = [];
			status_tmp = {};
			for (var i = 0; i < 21; i++) {
				if (list[i] && list[i].owner) {
					var bp = list[i].owner;
					bps.push(bp);
					status_tmp[bp] = "unknown"
				}
			}
		}
	});

}

// function getBpStatusChangeLogs () {
// 	var array = []

// 	if (fs.existsSync(bp_status_log_file)) {
// 		var res = fs.readFileSync(bp_status_log_file, 'utf8').split("\r\n");
// 		for (var i = 0; i < res.length - 1; i++) {
// 			array[i] = JSON.parse(res[i]);
// 		}
// 	}

// 	return array;
// }

function bp_status() {

	// 启动前三分钟不显示结果
	if (new Date().getTime() - start_time < 3*60*1000) {
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
// function bp_status_change_logs_function() {
// 	return {
//     	log_birthtime: bp_status_log_birthtime,
//     	now_time: now_time,
//     	rows: util.copy(bp_status_change_logs).reverse().slice(0, 100),
//     };
// }

exports.bp_status = bp_status
// exports.bp_status_change_logs = bp_status_change_logs_function