//The controllers for products of the application, Colum Foskin 20062042, Component Development, Applied Computing.

var eCommerceApp = angular.module('eCommerceApp');

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
      UserService.updateUser($scope.loggedInUser);
      $location.path('/payForOrder');
    }
  };
});

//controller to allow the use finish off the order process
eCommerceApp.controller('PayForOrderController', 
  function ($scope,$location,UserService) {
   $scope.loggedInUser = UserService.loggedInUser;
     $scope.loggedInUserOrders = $scope.loggedInUser.orders; 
     $scope.incompleteOrder = null;
     debugger;
     $scope.loggedInUserOrders.forEach(function(order) {
       if(order.status === 'incomplete'){
        $scope.incompleteOrder = order;
      }
    });
     $scope.total = $scope.incompleteOrder.total;
     $scope.payForOrder = function(){
      if($scope.loggedInUser.payForOrder($scope.incompleteOrder)){
        UserService.updateUser($scope.loggedInUser);
        alert("Order Completed");
        $location.path('/account');
      }
    }
  });
