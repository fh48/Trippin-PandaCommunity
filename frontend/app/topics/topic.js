angular.module('tpanda.topic', ['ui.bootstrap'])
    .controller('TopicCtrl', function($scope, $routeParams, $http, current){

      // Draw current information from service
      $scope.destination = current.destination;
      $scope.topic = current.topic;

      // Stores injected posts
      $scope.posts = [];

      $scope.getPosts = function(){
        $http({
          method: 'GET',
          url: `/api/posts/${$scope.topic.id}`
        }).then(function successCallback(response){
          $scope.posts = response.data;
          console.log(`Success, received ${$scope.posts.length} posts!`);
        }, function errorCallback(response){
          console.log('Error! '+ response.data);
        });
      }

      $scope.noPosts = function(){
        return ($scope.posts.length == 0 ? true : false);
      }

      $scope.ownPost = function(index){
        return current.isOwn($scope.posts[index].value.created_by);
      }

      $scope.reactedTo = function(index){
        return ($scope.posts[index].value.voters.indexOf(current.user.username)!=-1);
      }

      // Post creation section
      $scope.newPost = {
        text: "",
        topic: $scope.topic.id
      };
      $scope.invalidText = function(){
        return ($scope.newPost.text =="")
      }

      $scope.createPost = function(){
        console.log(`Creating a new post: ${$scope.newPost.text}`);

        $http({
          method: 'POST',
          url: '/api/posts/',
          data: $scope.newPost,
          headers: {'Content-Type': 'application/json'}
        }).then(function successCallback(response){
          console.log('Success! ' + response.data);
          $scope.getPosts();
          $scope.clearForm();
        }, function errorCallback(response){
          console.log('Error! '+ response.data);
        });

        $scope.clearForm = function(){
          $scope.newPost.text = "";
        }
      }

      // Voting is handled by the server
      $scope.vote = function(index, vote) {
        console.log(`Voting: ${vote}`);
        $http({
          method: 'POST',
          url: `/api/posts/${$scope.posts[index].id}/vote/`,
          data: {"vote": vote},
          headers: {'Content-Type': 'application/json'}
        }).then(function successCallback(response){
          console.log('Success!');
          $scope.getPosts();
        }, function errorCallback(response){
          console.log('Error! '+ response.data);
        });
      }

      // Post edit section
      $scope.edit = function(index){
        $http({
          method: 'PATCH',
          url: `/api/posts/${$scope.posts[index].id}`,
          data: { "newText" : $scope.posts[index].value.text },
          headers: {'Content-Type': 'application/json'}
        }).then(function successCallback(response){
          console.log('Success, edited.');
          $scope.getPosts();
        }, function errorCallback(response){
          console.log('Error! '+ JSON.stringify(response.body));
        });
      }

      $scope.delete = function(index){
        console.log(`Deleting post called ${$scope.posts[index].value.text}`);
        $http({
          method: 'DELETE',
          url: `/api/posts/${$scope.posts[index].id}`,
          headers: {'Content-Type': 'application/json'}
        }).then(function successCallback(response){
          console.log('Success!');
          $scope.getPosts();
        }, function errorCallback(response){
          console.log('Error! '+ response.data);
        });
      }

      // First check if the user has logged in yet!
      if(current.checkLogin()){
        $scope.username = current.user.username;
        // This makes the call
        $scope.getPosts();
      };

    })

    .directive('post', function(){
      return{
        scope: {
          info: '=',
          index: '@'
        },
        templateUrl: 'app/topics/post.html'
      }
    })
    .directive('crtPost', function(){
      return{
        scope: false,
        templateUrl: 'app/topics/postCreate.html'
      }
    });
