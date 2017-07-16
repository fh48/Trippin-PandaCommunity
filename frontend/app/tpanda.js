 angular.module('tpanda', ['ngRoute', 'tpanda.main', 'tpanda.destination', 'tpanda.topic', 'tpanda.nav', 'tpanda.login', 'tpanda.user', 'ui.bootstrap'])

  .config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: 'app/login/login.html',
    controller: 'LoginCtrl'
  })

  .when('/main', {
    templateUrl: 'app/main/main.html',
    controller: 'MainCtrl'
  })

  .when('/destinations/:destination', {
    templateUrl: 'app/destinations/destination.html',
    controller: 'DestCtrl'
  })

  .when('/topics/:topic', {
    templateUrl: 'app/topics/topic.html',
    controller: 'TopicCtrl'
  })

  .when('/profile', {
    templateUrl: 'app/user/profile.html',
    controller: 'UserCtrl'
  })

  .otherwise({
    redirectTo: '/main'
  });
}])

  .service('pandatars', [ '$rootScope', function($rootScope){
    var panda = {
      pandapath : "/app/images/",
      pandas : ["panda1.png", "panda2.png", "panda3.png"],

      getPandaLink : function(index){
        return panda.pandapath+panda.pandas[index];
      }
    }

    return panda;
  }])

  // Manages the user's session on the front end
  .factory("current", function($window){
    var current = {};

    current.user = {};
    current.setUsername = function(username){
      current.user.username = username;
    }
    current.setAvatar = function(index){
      current.user.avatar = index;
    }

    current.destination = {};
    current.setDestination = function(dest){
      current.destination = dest;
    }

    current.topic = {};
    current.setTopic = function(top){
      current.topic = top;
    }

    current.checkLogin = function(){
      if(!current.user.username){
        console.log("User not logged in...");
        $window.location.href = '/#!/';
        return false;
      } else {
        console.log("User is logged in as "+current.user.username);
        return true;
      }
    }

    current.logOut = function(){
      console.log("logging out");
      current.user = {};
      $window.location.href = '/#!/';
    };

    current.isOwn = function(id){
      if(current.user.username=="admin"){
        return true;
      } else {
        return (id==current.user.username)};
    }

    return current;
  });
