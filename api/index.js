// bp 掉线自查

var express = require('express');
var morgan = require('morgan');
var compression = require('compression');

const bp_status = require('./lib/bp_status');
// const bp_info = require('./lib/bp_info');
const check_p2p = require('./lib/check_p2p');
const json2jsonp = require('./lib/json2jsonp');
// const bp_history = require('./lib/bp_history');

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
    '<a href="/bp_status_change_logs">/bp_status_change_logs</a><br>' +
    '<a href="/check_p2p?host=p2p-mainnet.fibos123.com&port=9977">/check_p2p</a><br>' +
    // '<a href="/bp_info?bpname=fibos123comm">/bp_info</a><br>'+
    // '<a href="/bp_history?bpname=fibos123comm">/bp_history</a><br>'+
    '<a href="/json2jsonp?url=' + encodeURIComponent("https://fibos.io/getExchangeInfo") + '&callback=call">/json2jsonp</a><br>' +
    '<center><img src="https://i.pinimg.com/originals/40/f4/82/40f4820842b40cca27a935d7906af3c9.jpg" width="400" /><br/>Gakki</center>'
  );
});

// BP 在线状态
app.get('/bp_status', function (req, res) {
  res.json(bp_status.bp_status());
});

// BP 在线状态变更记录
app.get('/bp_status_change_logs', function (req, res) {
  res.json(bp_status.bp_status_change_logs());
});

// BP 的出块统计、最终出块时间
// app.get('/bp_info', function (req, res) {
// 	var bpname = req.query.bpname;
// 	if (!/^[0-9a-z\.]*$/ig.test(bpname)) {
// 		res.send({});
// 		return;
// 	}
// 	bp_info.bp_info(bpname, function(data){
// 		res.send(data);
// 	})
// });

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

// 出块历史
// app.get('/bp_history', function (req, res) {
//     var bpname = req.query.bpname;
// 	if (!/^[0-9a-z\.]*$/ig.test(bpname)) {
// 		res.send({});
// 		return;
// 	}

//     bp_history.bp_history(bpname, function(data){
//     	res.json(data);
//     })
// });

// json2jsonp
app.get('/json2jsonp', function (req, res) {
  var url = req.query.url;
  const whiteList = [
    'https://fibos.io/getExchangeInfo',
    'https://api.bit.cc/ticker.php?c=fo&mk_type=btc',
    'https://api.bit.cc/ticker.php?c=eos&mk_type=btc',
  ]
  if (whiteList.indexOf(url) === 0) {
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

