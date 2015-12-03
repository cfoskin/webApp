//ecommerce app by Colum Foskin 20062042, Component Development, Applied Computing.
'use strict';
var eCommerceApp = angular.module('eCommerceApp', ['ngRoute']);
//routes
eCommerceApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
      templateUrl: '/myApp/partials/homePage.html',
      controller:  'HomePageController' 
    })
    .when('/products', {
      templateUrl: '/myApp/partials/products.html',
      controller: 'ProductPageController'
    })
    .when('/phones/:phoneId', {
      templateUrl: '/myApp/partials/phone-detail.html',
      controller: 'PhoneDetailCtrl'
    })
    .when('/users/:user_index',
    {
      templateUrl: '/myApp/partials/user_orders.html',
      controller: 'AdminController'
    })
    .when('/register', {
      templateUrl: '/myApp/partials/register.html',
      controller:  'RegisterController'
    })
    .when('/shoppingCart', {
      templateUrl: '/myApp/partials/shoppingCart.html',
      controller: 'ShoppingCartController'
    })
    .when('/account', {
      templateUrl: '/myApp/partials/account.html',
      controller:  'AccountController',
    })
    .when('/payForOrder', {
      templateUrl: '/myApp/partials/payForOrder.html',
      controller:  'PayForOrderController'
    })
    .when('/admin', {
      templateUrl: '/myApp/partials/admin.html',
      controller:  'AdminController'
    })
    .otherwise({
      redirectTo: '/'
    });

    // use the HTML5 History API to remove the # from url
    $locationProvider.html5Mode(true);
  }]);

//A service for storing user User Authentication
eCommerceApp.service('UserService', function (StorageService, $location) {
  this.loggedInUser = null;
  var users = [];
  // F
  this.refreshUsers = function(){
   var promise = StorageService.getUsers();
   promise.success(function(usersData) {
  users = usersData.map(function(userData) {//create User objects from the users stored in json
    return new User(userData);
  });
});
 };
 this.getUser = function (index) {
  if (index >=0 && index < users.length ) {
   return users[index]
 }
 return undefined
}
this.putUser = function(user) {
  StorageService.putUser(user,users);
};

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
  users.push(new User(userData));
  StorageService.postUser(users).success(function(){
    this.refreshUsers();
  }.bind(this));
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
this.updateUser = function(user, newPassword) {
  user.password = newPassword;
};
this.closeAccount = function(user){
  StorageService.deleteUser(user, users); 
};//end of function
});


//A service for storing user User Authentication
eCommerceApp.service('OrderService', function (StorageService) {
  var orders = [];

  this.getOrder = function(orderNum){
    return orders.filter(function(order){
      return order.orderNum === orderNum;
    }).pop();
  };

  this.postOrder = function(order){
    StorageService.postOrder(order);
  };  
});


//Storage service
eCommerceApp.service('StorageService', ['$http' , function ($http, UserService){
  this.getUsers = function() {
    return $http.get('/api/users/getUsers');
  };
  this.deleteUser = function(user, users){
    var index = users.indexOf(user);
    $http.delete('/api/users/' + user.id).success(function() {
      users.splice(index, 1);
    });
  };
  this.putUser = function(user,users) {
    $http.put('/api/users/' + user.id, 
      { "name": user.name, "lastName": user.lastName, "email": user.email, "address": user.address, "password": user.password, "orders": user.orders })
    .success(function() {
      users[user.id] = user;
    });
  };
  this.postUser = function(users) {
    return $http.post('/api/users/addUser', users.pop());
  };
  this.postOrder = function(order){
    $http.post('/api/orders/addOrder', order);
  };

  this.putOrder = function(order,orders) {
    $http.put('/api/orders/' + order._id, {"orderedProducts": order.orderedProducts, "total": order.total, "orderNum": order.orderNum, "status": order.status })
    .success(function() {
      orders[order._id] = order;
    });
  };
}]);


//A service for the phones
eCommerceApp.factory('PhoneService', ['$http' , function($http){
  var phones =[];
  $http.get('/api/phones/getPhones').success(function(phoneData) {
    phoneData.forEach(function(data) {
      phones.push(new Phone(data));
    });
  });
  var api = {
    postPhones: function(){//used to put the phones into the db first time around.
      $http.post('/api/phones/addPhones', phones);
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



//The Admin controller which allows the user to finish incomplete orders, and update 
//their password
eCommerceApp.controller('AdminController', 
  function ($scope,$location, $routeParams, UserService, StorageService) {
    $scope.loggedInUser = UserService.loggedInUser;//admin in this case
    $scope.users = UserService.getUsers();
    $scope.user = {  
      index : $routeParams.user_index, 
      detail : UserService.getUser($routeParams.user_index)
    };
    $scope.markDispatched = function(order){
      order.dispatchStatus = "Dispatched";
      UserService.putUser($scope.user.detail);
      alert("Order Marked as Dispatched");
    };
    $scope.deleteUser = function(userToDelete){
      StorageService.deleteUser(userToDelete, $scope.users);
      alert("The Chosen Account has now being closed!");
    }
  });


//the controller for the homepage which has only logging in.
eCommerceApp.controller('HomePageController', 
  function ($scope,$rootScope, $location, UserService,PhoneService) {
   $scope.signIn = {};
   UserService.refreshUsers();
    UserService.loggedInUser = false;//using this as a flag for ng-show
    $rootScope.showAccount =  UserService.loggedInUser;
    $rootScope.showAdmin =  true;
    $scope.signIn = function () {
      UserService.signIn($scope.signIn.email, $scope.signIn.password );
      if (UserService.loggedInUser){
        if(UserService.loggedInUser.email === "admin"){
          $rootScope.showAdmin =  false;
          $location.path('/admin');
        }
        else{
         $rootScope.showAccount = true;
         $location.path('/account');
       }
     }
     else{
          $scope.warning = true;//incorrect log in details
        }
      };
    });

//The account controller which allows the user to finish incomplete orders, and update 
//their password
eCommerceApp.controller('AccountController', 
  function ($scope,$location, UserService, OrderService,PhoneService) {
    $scope.loggedInUser = UserService.loggedInUser;
    $scope.phones = PhoneService.getPhones();
    $scope.orders = $scope.loggedInUser.orders; //UserService.getOrders($scope.loggedInUser);
    $scope.orderProp = 'age';
    $scope.quantity = 2;
    $scope.warning = false;//ng-show flag

    $scope.closeAccount = function(){
      UserService.closeAccount($scope.loggedInUser);
      alert("Your Account has now being closed!");
      $location.path('/');
    }
    $scope.payForOrder=  function($event){
      $scope.order = OrderService.getOrder($event.target.id);
      $location.path("/payForOrder");
    }
    $scope.updateUser = function () {
      if($scope.password1 === $scope.password2){
        UserService.updateUser($scope.loggedInUser, $scope.password1);
        alert("Password Changed! - Please log in again");
        UserService.signOut();
      }
      else{
        $scope.warning = true;
      }
    }
  });

//controller which is used by the navbar and footer which both have sign out feature
eCommerceApp.controller('SignOutController', 
 function ($scope,$location, UserService,StorageService) {
  $scope.signOut = function () {
   UserService.signOut();
   alert("You are now signed out")
   $location.path('/')
 }
});

//directive for navbar
eCommerceApp.directive('navbarDirective', function() {
  return {
    restrict: 'AE',
    templateUrl: '/myApp/partials/navbar.html',
    controller: 'SignOutController'
  }
});

//directive for footer
eCommerceApp.directive('footerDirective', function() {
  return {
    restrict: 'AE',
    templateUrl: '/myApp/partials/footer.html',
    controller: 'SignOutController'
  }
});

//registration controller
eCommerceApp.controller('RegisterController', function ($scope,UserService,$location) {
  $scope.users = UserService.getUsers();
  $scope.warning = false;//ng-show flag
  $scope.registerUser = function () {
    if(UserService.checkAlreadyReg($scope.newUser)){
      $scope.warning = true;
    }
    else{
      UserService.registerUser($scope.newUser);
      alert("Success! Please Sign In");
      $location.path('/');
    }
  }
});

//product page controller which allows a use to add an item to their cart
eCommerceApp.controller('ProductPageController', function ($scope,$location,PhoneService, UserService) { 
  $scope.phones = PhoneService.getPhones();
    //PhoneService.postPhones();//used to put the phones in the db first time around
    $scope.loggedInUser = UserService.loggedInUser;
    $scope.warning = false;//ng-show flag
    $scope.addToCart = function($event){
      if($scope.loggedInUser){
        var phone = PhoneService.getPhone($event.target.id)
        PhoneService.addToCart(phone,$scope.loggedInUser);
      }
      else{
        $scope.warning = true;
      }
    }
    $scope.orderProp = 'age';
  });

//controller for the individual phone detail page
eCommerceApp.controller('PhoneDetailCtrl', 
 ['$scope', '$location', '$routeParams', 'PhoneService', 
 function($scope, $location, $routeParams, PhoneService) {
  PhoneService.loadPhone($routeParams.phoneId).success(function(data) {
    $scope.phone = data;
    $scope.img = $scope.phone.images[0]
  })
  $scope.setImage = function(img) {
    $scope.img = img;
  }
}]);

//shopping cart controller for removing items or creating an order from the cart
eCommerceApp.controller('ShoppingCartController', 
  function ($scope,$location,UserService,PhoneService,OrderService,StorageService) {
    $scope.loggedInUser = UserService.loggedInUser;
    $scope.warning = false;//ng-show flag
    if( $scope.loggedInUser === null){
      alert("Please log in or create and account to view your shopping cart!");
      $location.path('/')
    }
    $scope.removeFromCart=  function($event){
      var phone = PhoneService.getPhone($event.target.id);
      $scope.loggedInUser.removeItemFromCart(phone);
    }
    $scope.createOrder = function(){
     if(!$scope.loggedInUser.shoppingCart.hasItems()){//check for empty cart
      $scope.warning = true;
    }
    else{
      var order = $scope.loggedInUser.createOrder();
      OrderService.postOrder(order);
      UserService.putUser($scope.loggedInUser);
      $location.path('/payForOrder');
    }
  };
});

//controller to allow the use finish off the order process
eCommerceApp.controller('PayForOrderController', 
  function ($scope,$location,UserService) {
     $scope.loggedInUser = UserService.loggedInUser;
     $scope.loggedInUserOrders = $scope.loggedInUser.orders; //UserService.getOrders($scope.loggedInUser);
     $scope.incompleteOrder = $scope.loggedInUserOrders[$scope.loggedInUserOrders.length -1];
     $scope.total = $scope.incompleteOrder.total;

    $scope.payForOrder = function(){
      if($scope.loggedInUser.payForOrder($scope.incompleteOrder)){
        UserService.putUser($scope.loggedInUser);
        alert("Order Completed");
        $location.path('/account');
      }
     }
  });

//the User model
function User(data) {
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