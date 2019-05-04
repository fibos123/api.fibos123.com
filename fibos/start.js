// 服务器 全节点

var fibos = require('fibos');
var fs = require("fs");
var http = require('http');
var p2p = require("./p2p.json");

var httpClient = new http.Client();

fibos.config_dir = './data';
fibos.data_dir = './data'

var chain = {
  'chain-state-db-size-mb': 8192,
};

deleteFolderRecursive("./data/blocks")
deleteFolderRecursive("./data/state")
var snapshots = fs.readdir("./data/snapshots")
var snapshot = '';
if (snapshots.length) {
  snapshot = snapshots[0]
  console.log("snapshot", snapshot)
}
if (snapshot) {
  chain["snapshot"] = './data/snapshots/' + snapshot
} else {
  chain["genesis-json"] = "./genesis.json";
}

fibos.load("http", {
  "http-server-address": "0.0.0.0:8888",
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "Content-Type",
  "http-validate-host": false,
  "verbose-http-errors": true,
});

setInterval(function () {
  console.log(httpClient.get("http://localhost:8888/v1/producer/create_snapshot").json())
  var snapshots = fs.readdir("./data/snapshots")
  for (var i = 0; i < snapshots.length - 1; i++) {
    fs.unlink('./data/snapshots/' + snapshots[i])
  }
}, 1 * 60 * 60 * 1000) // ever 1 hour backup

fibos.load("net", {
  "max-clients": 0,
  "p2p-max-nodes-per-host": 20,
  "p2p-listen-endpoint": "0.0.0.0:9876",
  "p2p-peer-address": p2p,
});

fibos.load("producer");
fibos.load("producer_api");

fibos.load("chain", chain);
fibos.load("chain_api");

fibos.start();

function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
