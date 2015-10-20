var eCommerceApp = angular.module('eCommerceApp', ['ngRoute']);

eCommerceApp.config(['$routeProvider',
      function($routeProvider) {
        $routeProvider
          .when('/views', {
            templateUrl: './partials/grid.html',
          })
          // .when('/phones/:phoneId', {
          //   templateUrl: 'partials/phone-detail.html',
          //   controller: 'PhoneDetailCtrl'
          // })
          .otherwise({
            redirectTo: '/views'
          })
      }])