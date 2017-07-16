 angular.module('tpanda', ['ngRoute', 'tpanda.main', 'tpanda.destination', 'tpanda.topic', 'tpanda.nav', 'ui.bootstrap'])

  .config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: 'app/main/main.html',
    controller: 'MainCtrl'
  })

  .when('/destination/:dest', {
    templateUrl: 'app/destinations/destination.html',
    controller: 'DestCtrl'
  })

  .when('/destination/:dest/:id', {
    templateUrl: 'app/topics/topic.html',
    controller: 'TopicCtrl'
  })

  .when('/user/:id', {
    templateUrl: 'app/user/profile.html',
    controller: 'UserCtrl'
  })

  .otherwise({ redirectTo: '/'});

}]);
