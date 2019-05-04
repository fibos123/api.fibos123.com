// bp 掉线自查

var express = require('express');
var morgan = require('morgan');
var compression = require('compression');

const bp_status = require('./lib/bp_status');
const check_p2p = require('./lib/check_p2p');
const json2jsonp = require('./lib/json2jsonp');

var app = express();

var port = 3000;
console.log("v1.0.1");

// app.use(morgan('short'));
app.use(compression());

//allow custom header and CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// 首页
app.get('/', function (req, res) {
  res.send(
    '<a href="/bp_status">/bp_status</a><br>' +
    '<a href="/check_p2p?host=p2p-mainnet.fibos123.com&port=9977">/check_p2p</a><br>' +
    '<a href="/json2jsonp?url=' + encodeURIComponent("https://fibos.io/getExchangeInfo") + '&callback=call">/json2jsonp</a><br>' +
    '<center><img src="https://i.pinimg.com/originals/40/f4/82/40f4820842b40cca27a935d7906af3c9.jpg" width="400" /><br/>Gakki</center>'
  );
});

// BP 在线状态
app.get('/bp_status', function (req, res) {
  res.json(bp_status.bp_status());
});

// P2P 状态检查
app.get('/check_p2p', function (req, res) {
  var host = req.query.host;
  if (!/^[0-9a-z\.\-]*$/ig.test(host)) {
    res.send({});
    return;
  }
  var port = parseInt(req.query.port);
  check_p2p.check_p2p(host, port, function (data) {
    res.json(data)
  })
});

// json2jsonp
app.get('/json2jsonp', function (req, res) {
  var url = req.query.url;
  const whiteList = [
    'https://fibos.io/getExchangeInfo',
    'https://api.bit.cc/ticker.php?c=fo&mk_type=btc',
    'https://api.bit.cc/ticker.php?c=eos&mk_type=btc',
    'https://api.aex.plus/ticker.php?c=fo&mk_type=btc',
    'https://api.aex.plus/ticker.php?c=fo&mk_type=cnc',
  ]
  if (whiteList.indexOf(url) === -1) {
    res.send({});
    return;
  }
  var callback = req.query.callback;
  json2jsonp.json2jsonp(url, callback, function (data) {
    res.send(data);
  })
});


app.listen(port, function () {
  console.log('App listening on port', port);
});

