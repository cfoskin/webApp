//The models for the application, Colum Foskin 20062042, Component Development, Applied Computing.


function User(data) {
  this.role = 'User'//will pass validation
  this.id = data._id,
  this.name = data.name || '',
  this.lastName = data.lastName || '',
  this.email = data.email || '',
  this.address = data.address || '',
  this.password = data.password || '',
  this.shoppingCart = new ShoppingCart(),
  this.orders = data.orders || [],

  this.yourCredentials = function(email, password) {
    return email === this.email && password === this.password;
  }
  this.addItemToCart = function(phone){
    this.shoppingCart.add(phone);
  }
  this.removeItemFromCart = function(phone){
    this.shoppingCart.remove(phone);
  }
  this.createOrder = function(){
    var cartTotal = this.shoppingCart.calculateTotal();
    var orderIndex = this.orders.length +1;
    var order = new Order(this.shoppingCart.getItems(), cartTotal, orderIndex, 'Not Dispatched', 'incomplete');
    this.shoppingCart.emptyCart();
    this.orders.push(order);
    return order;
  }

  this.payForOrder = function(incompleteOrder){
   incompleteOrder.status = 'Completed';
   return true;
 }
}

//the Phone model
function Phone(data) {
  this.age = data.age || '',
  this.id = data.id || '',
  this.price = data.price || '',
  this.imageUrl = data.imageUrl || '',
  this.name = data.name || '',
  this.snippet = data.snippet || ''
}

//the Order model
function Order(orderedProducts, total, orderNum,dispatchStatus,status) {
  this.orderedProducts = orderedProducts,
  this.total = total,
  this.orderNum = orderNum,
  this.dispatchStatus = dispatchStatus,
  this.status = status
};

//the shopping cart model
function ShoppingCart(){
  this.items = [],

  this.calculateTotal = function(){
    var total =0;
    this.items.forEach(function(phone) {
      total += phone.price;
    })
    return total;
  }
  this.add = function(phone){
    var index = this.items.indexOf(phone);
    if(index < 0){
      this.items.push(phone);
    }
  }
  this.remove = function(phone){
    var index = this.items.indexOf(phone);
    this.items.splice(index, 1);
  }
  this.emptyCart = function(){
    this.items = [];
  }
  this.getItems =function(){
    return this.items;
  }
  this.hasItems = function() {
    return this.items.length > 0;
  }
}