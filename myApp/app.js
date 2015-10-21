var eCommerceApp = angular.module('eCommerceApp', ['ngRoute']);

eCommerceApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
      templateUrl: '/myApp/views/partials/grid.html',
    })
    .when('/register', {
      templateUrl: '/myApp/views/partials/register.html',
    })
    .when('/shoppingCart', {
      templateUrl: '/myApp/views/partials/shoppingCart.html',
    })
    .when('/account', {
      templateUrl: '/myApp/views/partials/account.html',
    })
    .otherwise({
      redirectTo: '/'
    })

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }])