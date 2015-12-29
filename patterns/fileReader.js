var fs = require('fs');

var cache = {};

function readJSON (filename, cb) {
	fs.readFile(filename, 'utf-8', function(err, data) {
		var parsed;
		if (err) { return cb(err); }

		try {
			parsed = JSON.parse(data);
		} catch(err) {
			return cb(err);
		}
		cb(null, parsed);
	});
}

function consistentRead(filename, cb) {
	if (cache[filename]) {
		/* Defer execution of the function until the next pass of the event loop: Guarantees the callback is invoked asynchronously */
		process.nextTick(function() {
			cb(cache[filename]);
		});
	} else {
		fs.readFile(filename, 'utf-8', function(err, data) {
			if (err) { throw err; }
			cache[filename] = data;
			cb(data);
		});
	}
}


function createFileReader(filename) {
	var listeners = [];
	consistentRead(filename, function(value) {
		listeners.forEach(function(listener) {
			listener(value);
		});
	});

	return {
		onDataReady: function(listener) {
			listeners.push(listener);
		}
	};
}

var read1 = createFileReader('factory.js');
var read2 = createFileReader('cryptSalt.js');
var read3 = createFileReader('module.js');
var read4 = createFileReader('proto.js');
/*
read1.onDataReady(function(data) {
	console.log('First call data: \n' + data);
	
	read2.onDataReady(function(data) {
		console.log('Second call data: \n' + data);
		
		read3.onDataReady(function(data) {
			console.log('Third call data: \n' + data);
			
			read4.onDataReady(function(data) {
				console.log('Fourth call data: \n' + data);
			});
		});
	});
});
*/
readJSON('2014-15 NBA Roster v0-3.json', function(err, data) {
	console.log(data);
});
