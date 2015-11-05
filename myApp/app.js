var eCommerceApp = angular.module('eCommerceApp', ['ngRoute']);

eCommerceApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
      templateUrl: '/myApp/views/partials/homePage.html',
      controller:  'HomePageController' 
    })
    .when('/products', {
      templateUrl: '/myApp/views/partials/products.html',
      controller: 'ProductPageController'
    })
    .when('/landingPage', {
      templateUrl: '/myApp/views/partials/landingPage.html',
    })
    .when('/phones/:phoneId', {
      templateUrl: '/myApp/views/partials/phone-detail.html',
      controller: 'PhoneDetailCtrl'
    })
    .when('/register', {
      templateUrl: '/myApp/views/partials/register.html',
      controller:  'RegisterController'

    })
    .when('/shoppingCart', {
      templateUrl: '/myApp/views/partials/shoppingCart.html',
      controller: 'ShoppingCartController'
    })
    .when('/account', {
      templateUrl: '/myApp/views/partials/account.html',
      controller:  'AccountController',
    })
    .when('/checkOut', {
      templateUrl: '/myApp/views/partials/checkOut.html',
      controller:  'CheckOutController'
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
  this.isUserLoggedIn = false;
  var users = StorageService.getUsers();
  this.getUsers = function () {
    return users;
  }

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
      isUserLoggedIn = true;
    }.bind(this));

  }
  this.logOut = function() {
   this.loggedInUser = null;
   isUserLoggedIn = false;
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
  function ($scope, $location, AuthenticationService,PhoneService) {
    $scope.logIn = {};
    //REMOVE AT END!!!!!!
    //AuthenticationService.loggedInUser = AuthenticationService.getUsers()[0];
    $scope.logIn = function () {
      if(AuthenticationService.isUserLoggedIn){
        AuthenticationService.loggedInUser = null;
      }
      AuthenticationService.logIn($scope.logIn.email, $scope.logIn.password );
      if (AuthenticationService.loggedInUser){
        $location.path('/account')
      }
    }
    $scope.phones = PhoneService.getPhones();
    $scope.orderProp = 'age';
    $scope.quantity = 2;
  });

eCommerceApp.controller('AccountController', 
 function ($scope,$location,$routeParams, AuthenticationService) {
  $scope.loggedInUser = AuthenticationService.loggedInUser;
  if( $scope.loggedInUser === null){
   //alert("Please log in or create and account to view your account page!");
   $location.path('/')
 }

 $scope.logOut = function () {
  AuthenticationService.logOut();
  $location.path('/')
}

$scope.updateUser = function () {
  if($scope.password1 === $scope.password2){
      AuthenticationService.updateUser($scope.loggedInUser, $scope.password1);
      alert("Password Changed! - Please log in again");
      this.logOut();
  }
  else{
    alert("passwords do not match");
  }
}
});

eCommerceApp.controller('RegisterController', function ($scope,AuthenticationService,$location) {
  $scope.users = AuthenticationService.getUsers();
  $scope.registerUser = function () {
    if(AuthenticationService.checkAlreadyReg($scope.newUser)){
      alert("This email address is already registered - Please try again");
      $location.path('/register');
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
    $scope.addToCart = function($event){
      if($scope.loggedInUser){
        var phone = PhoneService.getPhone($event.target.id)
        PhoneService.addToCart(phone,$scope.loggedInUser);
      }
      else{
        alert("Please log in to add items to your cart");
        $location.path("/");
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
    if( $scope.loggedInUser === null){
      alert("Please log in or create and account to view your shopping cart!");
      $location.path('/')
    }
    $scope.removeFromCart=  function($event){
      var phone = PhoneService.getPhone($event.target.id);
      $scope.loggedInUser.removeItemFromCart(phone);
    }

    $scope.checkOut = function(){
      $scope.loggedInUser.myCartItems.length
      if($scope.loggedInUser.myCartItems.length == 0){
        alert("Please add items to your cart first!");
        $location.path("/products")
      }
      else{
        var cartTotal = $scope.loggedInUser.calculateCartTotal();
        if($scope.loggedInUser.checkOut($scope.loggedInUser.myCartItems, cartTotal)){
          $location.path('/checkOut');
        }
      }
    }
  });

eCommerceApp.directive('navbarDirective', function() {
  return {
    restrict: 'AE',
    templateUrl: './partials/navbar.html',
    controller: 'AccountController'
  }
});

eCommerceApp.directive('footerDirective', function() {
  return {
    restrict: 'AE',
    templateUrl: './partials/footer.html'
  }
});

eCommerceApp.controller('CheckOutController', 
  function ($scope,$location,AuthenticationService,PhoneService) {
    $scope.loggedInUser = AuthenticationService.loggedInUser;
    if( $scope.loggedInUser === null){
      $location.path('/')
    }
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
  this.myCartItems = data.myCartItems || [],
  this.myOrders = data.myOrders || [],

  this.yourCredentials = function(email, password) {
    return email === this.email && password === this.password;
  }

  this.addItemToCart = function(phone){
    return this.myCartItems.push(phone);
  }

  this.removeItemFromCart = function(phone){
    var index = this.myCartItems.indexOf(phone);
    return this.myCartItems.splice(index, 1);
  }

  this.calculateCartTotal = function(){
    var total =0;
    this.myCartItems.forEach(function(phone) {
      total += phone.price;
    })
    return total;
  }

  this.checkOut = function(cartItems, cartTotal){
   var orderIndex = this.myOrders.length +1;
   var order = new Order(cartItems, cartTotal, orderIndex, false);
   this.myCartItems = [];
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

function Order(orderedProduct, orderPrice, orderNum, isCompleted) {
  this.orderedProduct = orderedProduct,
  this.isCompleted = isCompleted,
  this.orderPrice = orderPrice,
  this.orderNum = orderNum,
  this.orderStatus = 'Incomplete'



};

