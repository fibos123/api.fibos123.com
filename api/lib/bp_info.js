const db = require('./mongodb');
db.queue.setMax(1);

var bp_info_temp = {};

setTimeout(function (){
	db.go("action_traces", "ensureIndex", {"receipt.receiver":1},{background: true, sparse: true})
	db.go("blocks", "ensureIndex", { "block_num": -1 },{background: true, sparse: true});
	db.go("blocks", "ensureIndex", { "block.producer": 1 },{background: true, sparse: true});
	db.go("blocks", "ensureIndex", { "block.producer": 1, block_num: 1 },{background: true, sparse: true});
}, 1000)

function bp_info(bpname, callback){
	var coll = 'blocks';
	var block_count = 0, first_time = 0, first_block = 0, last_time = 0, last_block = 0;
	var data = {"block.producer": bpname};

	// null
	if (!bpname) {
	    return callback({
	    	bpname: bpname,
	    	block_count: block_count,
	    	first_time: first_time,
	    	first_block: first_block,
	    	last_time: last_time,
	    	last_block: last_block,
	    });
	}

	console.log("bp_info " + bpname)

	// cache 1s
	var cache_time = 1000;
    if (bp_info_temp[bpname] && new Date().getTime() - bp_info_temp[bpname]["time"] < cache_time) {
		// out cache
		return callback({
	    	bpname: bpname,
	    	block_count: (bp_info_temp[bpname]) ? bp_info_temp[bpname].block_count : block_count,
	    	first_time: (bp_info_temp[bpname]) ? bp_info_temp[bpname].first_time : first_time,
	    	first_block: (bp_info_temp[bpname]) ? bp_info_temp[bpname].first_block : first_block,
	    	last_time: (bp_info_temp[bpname]) ? bp_info_temp[bpname].last_time : last_time,
	    	last_block: (bp_info_temp[bpname]) ? bp_info_temp[bpname].last_block : last_block,
	    });
    }

	console.time("bp_info " + bpname)
	// console.time("bp_info count " + bpname)
	db.go(coll, 'count', data).then(function (count){
		block_count = count;
	}, function (err){})

	var options = {limit: 1, sort: {block_num: -1}};
	// console.time("bp_info find1 " + bpname)
	db.go(coll, 'find', data, options).then(function (data){
		if (data && data[0] && data[0].block && data[0].block.timestamp) {
			last_time = data[0].block.timestamp;
			last_block = data[0].block_num;
		}
		// console.timeEnd("bp_info find1 " + bpname)
	}, function (err){})

	var options = {limit: 1, sort: {block_num: 1}};
	// console.time("bp_info find2 " + bpname)
	db.go(coll, 'find', data, options).then(function (data){
		if (data && data[0] && data[0].block && data[0].block.timestamp) {
			first_time = data[0].block.timestamp;
			first_block = data[0].block_num;
		}
		bp_info_temp[bpname] = {
			time: new Date().getTime(),
	    	block_count: block_count,
	    	first_time: first_time,
	    	first_block: first_block,
	    	last_time: last_time,
	    	last_block: last_block,
		};

		callback({
	    	bpname: bpname,
	    	block_count: (bp_info_temp[bpname]) ? bp_info_temp[bpname].block_count : block_count,
	    	first_time: (bp_info_temp[bpname]) ? bp_info_temp[bpname].first_time : first_time,
	    	first_block: (bp_info_temp[bpname]) ? bp_info_temp[bpname].first_block : first_block,
	    	last_time: (bp_info_temp[bpname]) ? bp_info_temp[bpname].last_time : last_time,
	    	last_block: (bp_info_temp[bpname]) ? bp_info_temp[bpname].last_block : last_block,
	    });
	    
		// console.timeEnd("bp_info find2 " + bpname)
		console.timeEnd("bp_info " + bpname);
	}, function (err){})

}
exports.bp_info = bp_info