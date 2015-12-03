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