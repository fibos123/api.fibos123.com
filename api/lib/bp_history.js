const db = require('./mongodb2');
db.queue.setMax(1);
// db.option('autoPrint');

var bp_history_temp = {};

function bp_history(bpname, callback) {
	var genesis_time = Math.floor(new Date("2018-08-28T00:00:00.000Z").getTime() / 1000);
	var pointStart = genesis_time * 1000;
	var pointInterval = 12*21/2*1000;

	// cache 30min - 60min
	var cache_time = 30 * 60 + Math.ceil(Math.random()* 30 * 60);
	// out cache
	callback({
    	bpname: bpname,
    	pointStart: pointStart,
    	pointInterval: pointInterval,
    	dataLength: (bp_history_temp[bpname]) ? bp_history_temp[bpname].rows.length : 0,
    	rows: (bp_history_temp[bpname]) ? bp_history_temp[bpname].rows : []
    });
    if (bp_history_temp[bpname] && (new Date().getTime() - bp_history_temp[bpname]["time"]) / 1000 < cache_time) {
    	return;
    } else {
    	bp_history_temp[bpname] = {
    		time: new Date().getTime(),
	    	pointStart: pointStart,
	    	pointInterval: pointInterval,
	    	dataLength: (bp_history_temp[bpname]) ? bp_history_temp[bpname].rows.length : 0,
	    	rows: (bp_history_temp[bpname]) ? bp_history_temp[bpname].rows : []
    	}
    }

	var coll = 'blocks';
	var data = [{"block.producer": bpname}, {"block.timestamp": 1, "_id": 0}];

	var day = 3650;
	var items = [];
	var now_time = Math.floor(new Date().getTime() / 1000);
	for (var i = 0; i < (now_time - genesis_time) / (21 / 2 * 12); i++) {
		items.push(0);
	}

	var options = {limit: 2*60*60*24*day/21};
	// var options = {limit: 100, sort: {block_num: -1}};
	console.log("bp_history " + bpname)
	console.time("bp_history " + bpname)
	db.go(coll, 'find', data, options).then(function (data){
		for (var i = 0; i < data.length; i++) {
			var time = Math.floor(new Date(data[i].block.timestamp + "Z").getTime() / 1000);
			var rotate = Math.floor((time - genesis_time) / (12/2*21))
			// console.log(rotate)
			items[rotate]++ ;
		}

		bp_history_temp[bpname] = {
			time: new Date().getTime(),
	    	dataLength: items.length,
	    	rows: items
		};

		console.timeEnd("bp_history " + bpname);
	}, function (err){})
}

exports.bp_history = bp_history;

