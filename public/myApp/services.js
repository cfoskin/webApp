//The services for the application Colum Foskin 20062042, Component Development, Applied Computing.

var eCommerceApp = angular.module('eCommerceApp');

//A service for all things user related.
eCommerceApp.service('UserService', function (StorageService, $location) {
  this.loggedInUser = null;
  var users = [];

  this.refreshUsers = function(){
   var promise = StorageService.getUsers();
   promise.success(function(usersData) {
    users = usersData.map(function(userData) {//create User objects from the users stored in json
    var newUser = new User(userData);
    if(userData.name == 'admin'){
     newUser.role = 'Admin'
   }
   return newUser;   
 });
});
 };
 this.getUser = function (index) {
  if (index >=0 && index < users.length ) {
   return users[index]
 }
 return undefined
}

this.getUsers = function () {
  return users;
};
//check if a user has already registered with the entered email.
this.checkAlreadyReg = function(userData){
  var result = false;
  users.some(function(user){
    if(user.email === userData.email){
      result = true;
    }
    else{
      result = false;
    }
  });
  return result;
};
this.registerUser = function(userData) {
  var newUser = new User(userData)
  if(userData.name == 'admin'){
   newUser.role = 'Admin'
 }
 users.push(newUser);
 return StorageService.postUser(users);
};

this.signIn = function(email, password) {
  users.forEach(function(user) {
    if(user.yourCredentials(email, password))
      this.loggedInUser = user;
  }.bind(this));
};
this.signOut = function() {
 this.loggedInUser = null;
};
this.changePassword = function(user, newPassword) {
  user.password = newPassword;
};
this.updateUser = function(user) {
  StorageService.putUser(user,users);
};
this.closeAccount = function(user){
  StorageService.deleteUser(user, users); 
};
});


//Storage service that interacts with the db.
eCommerceApp.service('StorageService', ['$http' , function ($http, UserService){
  this.getUsers = function() {
    return $http.get('/api/users');
  };
  this.deleteUser = function(user, users){
    var index = users.indexOf(user);
    $http.delete('/api/users/' + user.id).success(function() {
      users.splice(index, 1);
    });
  };
  this.putUser = function(user,users) {
    $http.put('/api/users/' + user.id, 
      { "role": user.role, "name": user.name, "lastName": user.lastName, "email": user.email, "address": user.address, "password": user.password, "orders": user.orders })
    .success(function() {
      users[user.id] = user;
    });
  };
  this.postUser = function(users) {
    return $http.post('/api/users', users.pop());
  };
  this.postOrder = function(order){
    $http.post('/api/orders', order);
  };

  this.putOrder = function(order,orders) {
    $http.put('/api/orders/' + order._id, {"orderedProducts": order.orderedProducts, "total": order.total, "orderNum": order.orderNum, "status": order.status })
    .success(function() {
      orders[order._id] = order;
    });
  };
}]);


//A service for the Orders
eCommerceApp.service('OrderService', function (StorageService) {
  var orders = [];
  this.getOrders = function(){
    return orders;
  }

  this.getOrder = function(orderNum){
    return orders.filter(function(order){
      return order.orderNum === orderNum;
    }).pop();
  };

  this.postOrder = function(order){
    StorageService.postOrder(order);
  };  
});


//A service for the phones
eCommerceApp.factory('PhoneService', ['$http' , function($http){
  var phones =[];
  $http.get('/api/phones').success(function(phoneData) {
    phoneData.forEach(function(data) {
      phones.push(new Phone(data));
    });
  });
  var api = {
    postPhones: function(){//used to put the phones into the db first time around.
      $http.post('/api/phones/', phones);
    },
    getPhones : function() {
      return phones;
    },
    addToCart : function(phone, user){
      user.addItemToCart(phone);
    },
    getPhone : function(id){
      return phones.filter(function(phone){
        return phone.id === id;
      }).pop();         
    },
    loadPhone : function(id){
      return $http.get('/myApp/phones/' + id + '.json');
    }
  };
  return api;
}]);

