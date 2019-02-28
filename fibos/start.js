// 服务器 全节点

var fibos = require('fibos');
var fs = require("fs");
var p2p = require("./p2p.json");

fibos.config_dir = '/data';
fibos.data_dir = '/data'

var chain = {
    'chain-state-db-size-mb': 8192,
};
if (!fs.exists(fibos.data_dir + "/blocks")) {
    chain["genesis-json"] = "/fibos/genesis.json";
}

fibos.load("http", {
    "http-server-address": "0.0.0.0:8888",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "Content-Type",
    "http-validate-host": false,
    "verbose-http-errors": true,
});

fibos.load("net", {
    "max-clients": 0,
    "p2p-max-nodes-per-host": 20,
    "p2p-listen-endpoint": "0.0.0.0:9876",
    "p2p-peer-address": p2p,
});

fibos.load("producer");

fibos.load("chain", chain);
fibos.load("chain_api");

fibos.start();
