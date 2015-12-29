
var Obj = require('./proto');
var basketMod = require('./module');

var alex = new Obj.Person("Alex", 33, "5'11", 190);

var car = new Obj.Car("Honda", 2008, 52000);

var basket = basketMod.basket;
var basket2 = basketMod.basket;
/*
console.log( alex.toString() );
console.log(car.toString());

test.incrementCounter();
test.incrementCounter();
test.resetCounter();
test.setCounter(10);
console.log(test.getCounter());
test.decrementCounter();
console.log(test.getCounter());
*/

basket.addItem({item: "Turkey", price: 12.99});
basket.addItem({item: "Beer", price: 9.99});
basket.addItem({item: "Cheese", price: 4.67});
basket.addItem({item: "Oranges", price: 0.97});
basket.addItem({item: "Ice", price: 1.99});
basket.addItem({item: "Bread", price: 3.99});

console.log("Item count: " + basket.getItemCount());
basket.display();
console.log("Total cost: $" + basket.getTotal());
basket.clearBasket();

console.log("");

basket2.addItem({item: "Chicken", price: (Math.random() * 25).toFixed(2)});
basket2.addItem({item: "Wine", price: (Math.random() * 15).toFixed(2)});
basket2.addItem({item: "Yogurt", price: (Math.random() * 10).toFixed(2)});
basket2.addItem({item: "Apples", price: (Math.random() * 2).toFixed(2)});
basket2.addItem({item: "Ice Cubes", price: (Math.random() * 3).toFixed(2)});
basket2.addItem({item: "Pita", price: (Math.random() * 5).toFixed(2)});

console.log("Item count: " + basket2.getItemCount());
basket.display();
console.log("Total cost: $" + basket2.getTotal());