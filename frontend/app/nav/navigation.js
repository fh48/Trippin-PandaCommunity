angular.module('tpanda.nav', ['ui.bootstrap'])
.controller('NavBarCtrl', function($scope, $rootScope, current, pandatars){
  $scope.isNavCollapsed = true;
  $scope.loggedIn = false;
  $scope.username;

  $scope.pandapic;

  $scope.logOut = function(){
    current.logOut();
  }

  $rootScope.$on('$routeChangeSuccess', function(next, moment){
    if(current.user.username){
      $scope.loggedIn = true;
      $scope.username = current.user.username;
      $scope.pandapic = pandatars.getPandaLink(current.user.avatar);
    } else {
      $scope.loggedIn = false;
      $scope.username = "";
    }
  });
})

.directive('navBar', function() {
  return {
    replace: true,
    templateUrl: 'app/nav/navigation.html'
  };
});
