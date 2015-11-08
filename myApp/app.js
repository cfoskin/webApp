var eCommerceApp = angular.module('eCommerceApp', ['ngRoute']);

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
    .when('/landingPage', {
      templateUrl: '/myApp/partials/landingPage.html',
    })
    .when('/phones/:phoneId', {
      templateUrl: '/myApp/partials/phone-detail.html',
      controller: 'PhoneDetailCtrl'
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
    .when('/completeOrder', {
      templateUrl: '/myApp/partials/completeOrder.html',
      controller:  'CompleteOrderController'
    })
    .otherwise({
      redirectTo: '/'
    })

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }]);

//A service for storing user User Authentication
eCommerceApp.service('AuthenticationService', function (StorageService, $location) {
  this.loggedInUser = null;
  var users = StorageService.getUsers();
  this.getUsers = function () {
    return users;
  }
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
  })
  return result;
}

this.registerUser = function(userData) {
 users.push(new User(userData));
    // StorageService.saveUsers(users);
  }

  this.logIn = function(email, password) {
    users.forEach(function(user) {
      if(user.yourCredentials(email, password))
        this.loggedInUser = user;
    }.bind(this));

  }
  this.signOut = function() {
   this.loggedInUser = null;
 }
 this.updateUser = function(user, newPassword) {
  user.password = newPassword;
}

});


//A service for storing users to local storage
eCommerceApp.service('StorageService', function () {
  this.getUsers = function() {
    var users = JSON.parse(localStorage.getItem('users'))  || [{name: 'colum', lastName:'foskin', address: 'waterford', email:'colum@foskin.com', password:'pass'}];
    return users.map(function(userData) {
      return new User(userData);
    });
  },

  this.saveUsers = function(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }
})


//A service for the phones
eCommerceApp.factory('PhoneService', ['$http' , function($http){
  var phones =[];
  $http.get('/myApp/phones/phones.json').success(function(phoneData) {
    phoneData.forEach(function(data) {
      phones.push(new Phone(data));
    });
  })
  var api = {
    getPhones : function() {
      return phones
    },
    addToCart : function(phone, user){
      user.addItemToCart(phone)
    },
    getPhone : function(id){
      return phones.filter(function(phone){
        return phone.id === id;
      }).pop();
    },
    loadPhone : function(id){
      return $http.get('/myApp/phones/' + id + '.json');
    }

  }
  return api;
}]);


eCommerceApp.controller('HomePageController', 
  function ($scope,$rootScope, $location, AuthenticationService) {
    $scope.logIn = {};
    AuthenticationService.loggedInUser = false;
    $rootScope.showAccount =  AuthenticationService.loggedInUser;
   // AuthenticationService.loggedInUser = AuthenticationService.getUsers()[0];
   $scope.logIn = function () {
        AuthenticationService.loggedInUser = null;//log out old
        AuthenticationService.logIn($scope.logIn.email, $scope.logIn.password );
        if (AuthenticationService.loggedInUser){
          $rootScope.showAccount = true;
          $location.path('/account');
        }
        else{
          $scope.warning = true;//incorrect log in details
        }
      }
    });

eCommerceApp.controller('AccountController', 
  function ($scope,$location, AuthenticationService, PhoneService) {
    $scope.loggedInUser = AuthenticationService.loggedInUser;
    $scope.phones = PhoneService.getPhones();
    $scope.orderProp = 'age';
    $scope.quantity = 2;
    $scope.warning = false;

    $scope.completeOrder=  function(){
      $location.path("/completeOrder");

    }
    $scope.updateUser = function () {
      if($scope.password1 === $scope.password2){
        AuthenticationService.updateUser($scope.loggedInUser, $scope.password1);
        alert("Password Changed! - Please log in again");
        this.signOut();
      }
      else{
        $scope.warning = true;
      }
    }
  });


eCommerceApp.controller('SignOutController', 
 function ($scope,$location, AuthenticationService) {
  $scope.signOut = function () {
    AuthenticationService.signOut();
    alert("You are now signed out")
    $location.path('/')
  }

});

eCommerceApp.directive('navbarDirective', function() {
  return {
    restrict: 'AE',
    templateUrl: './partials/navbar.html',
    controller: 'SignOutController'
  }
});



eCommerceApp.directive('footerDirective', function() {
  return {
    restrict: 'AE',
    templateUrl: './partials/footer.html',
    controller: 'SignOutController'
  }
});

eCommerceApp.controller('RegisterController', function ($scope,AuthenticationService,$location) {
  $scope.users = AuthenticationService.getUsers();
  $scope.warning = false;
  $scope.registerUser = function () {
    if(AuthenticationService.checkAlreadyReg($scope.newUser)){
      $scope.warning = true;
    }
    else{
      AuthenticationService.registerUser($scope.newUser);
      $location.path('/');
    }
  }
});

eCommerceApp.controller('ProductPageController', 
  function ($scope,$location,PhoneService, AuthenticationService) {     
    $scope.phones = PhoneService.getPhones();
    $scope.loggedInUser = AuthenticationService.loggedInUser;
    $scope.warning = false;
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

eCommerceApp.controller('PhoneDetailCtrl', 
 ['$scope', '$location', '$routeParams', 'PhoneService', 
 function($scope, $location, $routeParams, PhoneService) {
  PhoneService.loadPhone($routeParams.phoneId).success(function(data) {
    $scope.phone = data;
    $scope.img = $scope.phone.images[0]
  })


  $scope.setImage = function(img) {
    $scope.img = img
  }
}]);


eCommerceApp.controller('ShoppingCartController', 
  function ($scope,$location,AuthenticationService,PhoneService) {
    $scope.loggedInUser = AuthenticationService.loggedInUser;
    $scope.warning = false;
    if( $scope.loggedInUser === null){
      alert("Please log in or create and account to view your shopping cart!");
      $location.path('/')
    }
    $scope.removeFromCart=  function($event){
      var phone = PhoneService.getPhone($event.target.id);
      $scope.loggedInUser.removeItemFromCart(phone);
    }

    $scope.createOrder = function(){
     // $scope.loggedInUser.myCartItems.length
     if(!$scope.loggedInUser.shoppingCart.hasItems()){
      $scope.warning = true;
    }
    else{
      if($scope.loggedInUser.createOrder()){
        $location.path('/completeOrder');
      }
    }
  }
});

eCommerceApp.controller('CompleteOrderController', 
  function ($scope,$location,AuthenticationService,PhoneService) {
    $scope.loggedInUser = AuthenticationService.loggedInUser;
    var orders = $scope.loggedInUser.myOrders;
    var incompleteOrder = null;
    orders.forEach(function(order) {
     if(order.isCompleted === false){
      incompleteOrder = order;
    }
  });

    $scope.completeOrder = function(){
      if($scope.loggedInUser.completeOrder(incompleteOrder, incompleteOrder.orderPrice)){
        alert("Order Completed");
        $location.path('/account');
      }
    }

  });


function User(data) {
  this.name = data.name || '',
  this.lastName = data.lastName || '',
  this.email = data.email || '',
  this.address = data.address || '',
  this.password = data.password || '',
  this.shoppingCart = new ShoppingCart(),
  this.myOrders = data.myOrders || [],

  this.yourCredentials = function(email, password) {
    return email === this.email && password === this.password;
  }

  this.addItemToCart = function(phone){
    return this.shoppingCart.add(phone);
  }

  this.removeItemFromCart = function(phone){
   
    return this.shoppingCart.remove(phone);
  }

  this.createOrder = function(){
    var cartTotal = this.shoppingCart.calculateTotal();
    var orderIndex = this.myOrders.length +1;
    var order = new Order(this.shoppingCart.getItems(), cartTotal, orderIndex, false);
    this.shoppingCart.emptyCart();
    return this.myOrders.push(order);
  }

  this.completeOrder = function(incompleteOrder){
   incompleteOrder.orderStatus = 'Completed & Shipped';
   return incompleteOrder.isCompleted = true;
 }
}

function Phone(data) {
  this.age = data.age || '',
  this.id = data.id || '',
  this.price = data.price || '',
  this.imageUrl = data.imageUrl || '',
  this.name = data.name || '',
  this.snippet = data.snippet || ''
}

function Order(orderedProducts, orderPrice, orderNum, isCompleted) {
  this.orderedProducts = orderedProducts,
  this.isCompleted = isCompleted,
  this.orderPrice = orderPrice,
  this.orderNum = orderNum,
  this.orderStatus = 'Incomplete'

};



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
    this.items.push(phone);
  }

  this.remove = function(phone){
    var index = this.items.indexOf(phone);
    return this.items.splice(index, 1);
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