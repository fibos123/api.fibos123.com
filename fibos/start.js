// 服务器 全节点

var fibos = require('fibos');
var fs = require("fs");

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
    "p2p-listen-endpoint": "0.0.0.0:9876",
    "p2p-peer-address": [

        "p2p.eossay.com:9870",
        "p2p.otclook.com:9870",
        "seed.bitze.site:9870",
        "47.74.181.212:27672",
        "13.78.23.108:9870",
        "fibos.eosforum.one",
        "p2p.doittotheend.xyz:9870",
        "p2p.fometa.io:59877",
        "p2p-mainnet.fibos123.com:9977",
        "p2p.fibos.fi:59595",
        "p2p-mainnet.fobp.pro:9873",
        "va-p2p.fibos.io:9870",
        "ca-p2p.fibos.io:9870",
        "sl-p2p.fibos.io:9870",
        "api.fibosgenesis.com:9870",
        "p2p-mainnet.fibosironman.io:9999",
        "fibosiseos.xyz:9870",
        "47.92.122.2:9870",
        "se-p2p.fibos.io:9870",
        "p2p.fophoenix.com:9870",
        "seed.fibos.rocks:10100",
        "p2p.fospider.com:9870",
        "fibos.tokenasst.com:9870",
        "seed-mainnet.fibscan.io:9103",
        "p2p.mainnet.fibos.me:80",
        "40.115.179.182:9870",
        "p2p.foshenzhenbp.com:9877",
        "p2p.xm.fo:10300",
        "p2p-mainnet.ilovefibos.com:9876",
        "p2p-mainnet.loveyy.xyz:9871",
        "p2p.fibos.team:9876",
        "ln-p2p.fibos.io:9870",
        "seed.fiboso.com:9965",
        "185.243.57.158:9870",
        "fibos.smr123.com:7890",
        "fibos-p2p.slowmist.io:9870",
        "superfibos.com:9870",
        "to-p2p.fibos.io:9870",
        "p2p.touch-me.club:9870",
        "ppray.com:9870",
        "fibos.qubitfund.com:9870",
        "p2p-mainnet.qingah.com:9876",
        "47.96.101.244:9898",
    
    ],
});

fibos.load("producer");

fibos.load("chain", chain);
fibos.load("chain_api");

fibos.load("mongo_db", {
    "mongodb-uri": "mongodb://mongo:27017/fibos"
});

fibos.start();
