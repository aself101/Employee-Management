var basket = (function() {
	// Private vars and methods
	var basket = [];

	function displayBasket() {
		basket.forEach(function(cur, index) {
			console.log(index+1 + ') ' + cur.item + ', $' + cur.price);
		});
	}

	// Public vars and methods
	return {
		addItem: function(item) {
			basket.push(item);
		},
		getItemCount: function() {
			return basket.length;
		},
		clearBasket: function() {
			return basket.splice(0, basket.length);
		},
		display: displayBasket,
		getTotal: function() {
			var q = this.getItemCount();
			var p = 0;

			while(q--) {
				p += +basket[q].price;
			}
			return p.toFixed(2);
		}
	};
})();




/* Module pattern: More like classical OOP with private and public vars and methods */
var testModule = (function () {
	var counter = 0;
	return {
		setCounter: function(c) {
			counter = c;
		},
		getCounter: function() {
			return counter;
		},
		incrementCounter: function() {
			return counter++;
		},
		decrementCounter: function() {
			return counter--;
		},
		resetCounter: function() {
			console.log("counter value prior to reset: " + counter);
			counter = 0;
		}
	};
})();


module.exports = {
	basket: basket
};
