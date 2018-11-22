'use strict';

var url = {};
url.rpc = {};
url.rpc.endpoint = "http://fibos:8888";
url.rpc.get_table_rows = url.rpc.endpoint + "/v1/chain/get_table_rows";
url.rpc.get_info = url.rpc.endpoint + "/v1/chain/get_info";

var config = {}
config.log_file = "./log";
config.bp_status_log_file = "./data/_bp_status_log.txt";
config.bp_status_tmp_file = "./data/_bp_status_tmp.json";

exports.url = url;
exports.config = config;