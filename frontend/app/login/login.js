angular.module('tpanda.login', ['ui.bootstrap'])
    .controller('LoginCtrl', function($scope, $http, $window, current){

      $scope.user = {
        username: "",
        password: ""
      }

      $scope.newUser = {
        username: "",
        password: ""
      }

      $scope.newPasswordCheck = "";

      $scope.unmatchedPasswords = function(){
        return $scope.newUser.password!=$scope.newPasswordCheck;
      }

      $scope.invalidText = function(ob) {
        for(var prop in ob){
          if(ob[prop]== ""){
            return true;
          }
        }
        return false;
      }

      $scope.invalidSignup = function(){
        return ($scope.unmatchedPasswords() || $scope.invalidText($scope.newUser));
      }
      $scope.invalidLogin = function(){
        return ($scope.invalidText($scope.user));
      }

      $scope.signUp = function(){
        $http({
          method: 'POST',
          url: '/api/users/signup/',
          data: $scope.newUser,
          headers: {'Content-Type': 'application/json'}
        }).then(function successCallback(response){
          console.log(response.data);
          current.setUsername(response.data._id);
          current.setAvatar(response.data.avatar)
          $window.location.href = '/#!/main';
        }, function errorCallback(response){
          $scope.errorMessage = ("Oh no! That username is already taken!");
        });
      }

      $scope.login = function(){
        $http({
          method: 'POST',
          url: '/api/users/login/',
          data: $scope.user,
          headers: {'Content-Type': 'application/json'}
        }).then(function successCallback(response){
          console.log(response.data);
          current.setUsername(response.data._id);
          current.setAvatar(response.data.avatar)
          $window.location.href = '/#!/main';
        }, function errorCallback(response){
          // Display error message in the space beneath boxes
          $scope.errorMessage = ("Woops, that username or password doesn't seem to be right!");
        });
      }

});
