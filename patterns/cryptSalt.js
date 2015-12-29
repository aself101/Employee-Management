var crypto = require('crypto');
var pw = require('credential');

function testCrypto() {
	var createSalt = function createSalt(keyLength, callback) {
		crypto.randomBytes(keyLength, function (err, buff) {
			if (err) {
				return callback(err);
			}
			var salt = callback(null, buff.toString('base64'));
			
			// 
			crypto.pbkdf2('password', salt, 4096, 64, 'sha256', function(err, key) {
				if (err) throw err;
				console.log(key.toString('hex'));
			});

		});
	};


	return createSalt(28, function (err, data) {
		if (err) throw err;
		return data;
	});

}

var password = 'Some password of mine';
function hashIt(passw, cb) {

	pw.hash(passw, function(err, hash) {
		if (err) throw err;
		//console.log('Store the password hash: ' + hash);
		cb(hash);
	});
}

hashIt(password, function cb(data) {
	pw.verify(data, password, function(err, isValid) {
		var msg;
		if (err) throw err;
		msg = isValid ? 'Passwords match!' : 'Wrong password!';
		console.log(msg);
	});
});


var verify = function verify(username, password, verified) {
	var user = users.findOne(username);
	if (!user) {
		return verified(null, false, {
			message: 'User not found.'
		});
	}

	pw.verify(user.hash, password, function(isValid) {
		if (!isValid) {
			return verified(null, false, {
				message: 'Incorrect password'
			});
		}
		return verified(null, user);
	});
};





