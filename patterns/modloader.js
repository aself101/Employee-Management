var fs = require('fs');


function loadModule(filename. module, require) {
	var wrappedSrc =
		'(function(module, exports, require) {' +
			fs.readFileSync(filename, 'utf8') +
		'})(module, module.exports, require);';
	eval(wrappedSrc);
}


