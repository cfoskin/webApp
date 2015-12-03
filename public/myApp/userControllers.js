var eCommerceApp = angular.module('eCommerceApp');


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




