'use strict';

var url = {};
url.rpc = {};
url.rpc.endpoint = "http://api.fibos.rocks";
url.rpc.get_table_rows = url.rpc.endpoint + "/v1/chain/get_table_rows";
url.rpc.get_info = url.rpc.endpoint + "/v1/chain/get_info";
url.rpc.get_block = url.rpc.endpoint + "/v1/chain/get_block";

exports.url = url;
