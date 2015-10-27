var eCommerceApp = angular.module('eCommerceApp', ['ngRoute']);

eCommerceApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/home', {
      templateUrl: '/myApp/views/partials/homePage.html',
      controller:  'homePageController' 
    })
    .when('/products', {
      templateUrl: '/myApp/views/partials/products.html',
      controller: 'ProductPageController'
    })
    .when('/register', {
      templateUrl: '/myApp/views/partials/register.html',
      controller:  'registerController'

    })
    .when('/shoppingCart', {
      templateUrl: '/myApp/views/partials/shoppingCart.html',
      controller: 'shoppingCartController'
    })
    .when('/account', {
      templateUrl: '/myApp/views/partials/account.html',
      controller:  'accountController',
    })
    .otherwise({
      redirectTo: '/home'
    })

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }]);

//A service for storing user Authentication
eCommerceApp.service('AuthenticationService', function (StorageService) {
  this.loggedInUser = null;
  isUserLoggedIn = false;

  debugger;
  var users = StorageService.getUsers();
  
  this.getUsers = function () {
    return users;
  }

  this.addUser = function(userData) {
   users.push(new User(userData));
   StorageService.saveUsers(users);
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
}

this.updateUser = function(user) {
  user.password = user.password
}

});


//A service for storing users to local storage
eCommerceApp.service('StorageService', function () {
  this.getUsers = function() {
    var users = JSON.parse(localStorage.getItem('users'))  || [];
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
  var api = {
    getPhones : function() {
      return $http.get('/myApp/phones/phones.json')
    }
  }
  return api
}]);


eCommerceApp.controller('homePageController', 
  function ($scope, $location, AuthenticationService,PhoneService) {
    $scope.logIn = {};
    $scope.logIn = function () {
      AuthenticationService.logIn($scope.logIn.email, $scope.logIn.password );
      if (AuthenticationService.loggedInUser){
        $location.path('/account')
      }
    }

    PhoneService.getPhones().success(function(data) {
     $scope.phones = data
     $scope.phones.map(function(phoneData) {
      return new Phone(phoneData);
    });
   })
    $scope.orderProp = 'age';
    $scope.quantity = 2;
  });


eCommerceApp.controller('ProductPageController', 
  function ($scope,$location,PhoneService, AuthenticationService) {   
   PhoneService.getPhones().success(function(data) {
     $scope.phones = data

     $scope.phones.map(function(phoneData) {
      return new Phone(phoneData);
    });

   })
   $scope.orderProp = 'age';
   $scope.loggedInUser = AuthenticationService.loggedInUser;
 });


eCommerceApp.controller('shoppingCartController', 
 function ($scope,$location,AuthenticationService) {
  $scope.loggedInUser = AuthenticationService.loggedInUser;
  if( $scope.loggedInUser === null){
    $location.path('/')
  }
});

eCommerceApp.controller('accountController', 
 function ($scope,$location,$routeParams, AuthenticationService) {
  $scope.loggedInUser = AuthenticationService.loggedInUser;
  if( $scope.loggedInUser === null){
    $location.path('/')
  }

  $scope.logOut = function () {
    AuthenticationService.logOut();
    $location.path('/')
  }

  $scope.updateUser = function () {
   AuthenticationService.updateUser($scope.loggedInUser);
   this.logOut();
 }
});

eCommerceApp.controller('registerController', function ($scope,AuthenticationService) {
  $scope.users = AuthenticationService.getUsers();
  $scope.addUser = function () {
    AuthenticationService.addUser($scope.newUser);
    $scope.newUser = new User({});
  }
});


function User(data) {
  this.name = data.name || '',
  this.lastName = data.lastName || '',
  this.email = data.email || '',
  this.address = data.address || '',
  this.password = data.password || '',
  this.myCartItems = null || [],


  this.yourCredentials = function(email, password) {
    return email === this.email && password === this.password;
  }
}


function Phone(data) {
  this.age = data.age || '',
  this.id = data.id || '',
  this.imageUrl = data.imageUrl || '',
  this.name = data.name || '',
  this.snippet = data.snippet || ''
};
