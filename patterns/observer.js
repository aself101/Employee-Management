
/* Singleton pattern:  */
function Observer() {
	this.observerList = [];
}

Observer.prototype.add = function(obj) {
	return this.observerList.push(obj);
};

Observer.prototype.count = function() {
	return this.observerList.length;
};

Observer.prototype.get = function(index) {
	if (index > -1 && index < this.observerList.length) {
		return this.observerList[index];
	}
};

Observer.prototype.indexOf = function(obj, startIndex) {
	var i = startIndex;

	while (i < this.observerList.length) {
		if (this.observerList[i] === obj) {
			return i;
		}
		i++;
	}

	return -1;
};

Observer.prototype.removeAt = function(index) {
	this.observerList.splice(index, 1);
}


module.exports = Observer;
