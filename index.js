// bp 掉线自查

var express = require('express');
var compression = require('compression');

const bp_status = require('./bp_status');
const last_ghost = require('./last_ghost');

var app = express();

var port = process.env.PORT || 8080;
console.log("v1.0.4");

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
    '<a href="/last_ghost">/last_ghost</a><br>' +
    '<center><img src="https://i.pinimg.com/originals/40/f4/82/40f4820842b40cca27a935d7906af3c9.jpg" width="400" /><br/>Gakki</center>'
  );
});

// BP 在线状态
app.get('/bp_status', function (req, res) {
  res.json(bp_status.bp_status());
});

// 最新镜像
app.get('/last_ghost', async function (req, res) {
  res.end(await last_ghost.last_ghost());
});

app.listen(port, function () {
  console.log('App listening on port', port);
});

module.exports = app;
