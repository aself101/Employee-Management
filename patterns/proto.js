/* Prototype pattern; good for inheritance */
function Person(name, age, height, weight) {
	this.name = name;
	this.age = age;
	this.height = height;
	this.weight = weight;
}

Person.prototype.toString = function() {
	return this.name + " is " + this.age + " years old and has a height of " + this.height + ' and weight of ' + this.weight;
};


function Car( model, year, miles ) {
 
  this.model = model;
  this.year = year;
  this.miles = miles;
 
}

Car.prototype.toString = function () {
  return this.model + " has done " + this.miles + " miles";
};

module.exports = {
	Car: Car,
	Person: Person
};