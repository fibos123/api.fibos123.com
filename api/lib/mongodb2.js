'use strict';
// 依赖
const Queue = require('promise-queue-plus');
const mongo = require('mongodb').MongoClient;
var q = Queue.Q;
var _db;
var _iv;
var _coll = [];
var queue_max = 10;
var queue = new Queue(queue_max, {
        "retry": 0               //Number of retries
        ,"retryIsJump": false     //retry now? 
        // ,"timeout": 4000          //The timeout period
    });
var _bulkList = [];
var _option = [];

function db(url) {
    url = url || 'mongodb://mongo:27017/fibos';
    mongo.connect(url, function(err, db1) {
        if (err) {
            setTimeout(function (){
                db(url);
            }, 100)
            return;
        }
        _db = db1;
        if (getLength())
            queue.start();
    })
}

function queueGo(op, data) {
    if (_db)
        return queue.go(op, data)
    else
        return queue.push(op, data)
}

function coll(collName) {
    if (!_coll[collName])
        _coll[collName] = _db.collection(collName);
}

// 批量提交，用于大量插入更新操作
function queryMany(collName, op, data, options) {
    if (!_bulkList[collName])
        _bulkList[collName] = []
    
    if (data) {
        _bulkList[collName].push({op, data, options})
    }

    // 强制插入或满1000个操作
    if ((!op && _bulkList[collName].length > 0) || _bulkList[collName].length === 1000) {
        var items = _bulkList[collName];
        _bulkList[collName] = [];
        queueGo(_queryMany, [collName, items]).then(function (res){
	        }, function(err){
	        })
    }
}

function _queryMany(collName, items) {
    var deferred = q.defer();
    if (!_coll[collName])
        coll(collName)
    var bulk = _coll[collName].initializeUnorderedBulkOp();
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        switch(item.op) {
            case 'insert':
                bulk.insert(item.data, item.options, function (err, res){});
                break;
            case 'update':
                bulk.find(item.data).update(item.options);
                break;
            default:
        }
    }
    bulk.execute(function (err, res){
        if (err)
            deferred.reject(err)
        else
            deferred.resolve(res)
    })
    return deferred.promise;
}

function query(collName, op, data, options) {
    var deferred = q.defer();
    queueGo(_query, [collName, op, data, options]).then(function (res){
        deferred.resolve(res)
    }, function (err){
        deferred.reject(err)
    })
    return deferred.promise;
}

function _query(collName, op, data, options) {
    var deferred = q.defer();
    if (!_coll[collName])
        coll(collName)

    switch(op) {
        case 'find':
            var data1 = (data instanceof Array) ? data[0] : data;
            var data2 = (data instanceof Array) ? data[1] : {};
            _coll[collName].find(data1, data2).
                limit(options && options.limit || 100).
                skip(options && options.skip || 0).
                sort(options && options.sort || {}).
                toArray().then(function (items) {
                    deferred.resolve(items)
                })
            break;
        case 'drop':
            _coll[collName].drop(function (err, res){
                if (err)
                    deferred.reject(err)
                else
                    deferred.resolve(res)
            })
            break;
        default:
            _coll[collName][op](data, options, function (err, res){
                if (err)
                    deferred.reject(err)
                else
                    deferred.resolve(res)
            })
    }

    return deferred.promise;
}

function close() {
    if (_db)
        _db.close()
}

function option(key){
    _option[key] = 1;
    switch(key) {
        // 结束时显示执行时间
        case 'runTime':
            console.time("db");
            break;
        // 列队结束自动关闭数据库
        case 'autoClose':
            queue.option('queueEnd', function (){
                close();
                clearInterval(_iv);
                if (_option['runTime'])
                    console.timeEnd("db");
            })
            break;
        // 每秒打印当前数据
        case 'autoPrint':
            _iv = setInterval(function () {
                console.log(
                    new Date().toLocaleTimeString(),
                    'db:',
                    getLength().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                )
            }, 1000)
            break;
    }
}

// 获取列队长度
function getLength(){
    return queue.getRunCount() + queue.getLength();
}

db()
exports.db = db;
exports.queue = queue;
exports.query = exports.go = query;
exports.queryMany = exports.goX = queryMany;
exports.close = close;
exports.option = option;
exports.getLength = getLength;
