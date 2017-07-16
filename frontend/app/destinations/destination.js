angular.module('tpanda.destination', ['ui.bootstrap'])
.controller('DestCtrl', function($scope, $routeParams, $http, current, pandatars){

  // Draw current destination from service
  $scope.destination = current.destination;

  // Variable to store the injected topics
  $scope.topics = [];

  // Defines the call to get the list of topics available
  $scope.getTopics = function(){
    //console.log(`Getting topics for location:` + $scope.destination.value.name);
    $http({
      method: 'GET',
      url: `/api/topics/${$scope.destination.id}`
    }).then(function successCallback(response){
      $scope.topics = response.data;
      $scope.generateLinks();
      console.log(`Success, received ${$scope.topics.length} topics!`);
    }, function errorCallback(response){
      console.log('Error! '+ response.data);
    });
  }

  $scope.generateLinks = function(){
    for(let i=0; i<$scope.topics.length; i++){
      $scope.topics[i].path = `/#!/topics/${$scope.topics[i].id}`
      //console.log(`${$scope.topics[i].value.title} got link ${$scope.topics[i].path}`)
    }
  }

  // Checking for any topics
  $scope.noTopics = function() {
    return ($scope.topics.length == 0 ? true : false);
  }

  $scope.ownTopic = function(index){
    if(current.user.username=="admin"){return true} else {
      return current.isOwn($scope.topics[index].value.created_by);
    }
  }

  $scope.reactedTo = function(index){
    if($scope.topics[index].value.voters){
      return ($scope.topics[index].value.voters.indexOf(current.user.username)!=-1);
    } else {return true}
  }

  $scope.updateCurrent = function(index){
    current.setTopic($scope.topics[index]);
    //console.log(current.topic.value.title);
  }

  // Topic edit section
  $scope.edit = function(index){
    $http({
      method: 'PATCH',
      url: `/api/topics/${$scope.topics[index].id}`,
      data: { "newTitle" : $scope.topics[index].value.title },
      headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(response){
      console.log('Success, edited.');
      $scope.getTopics();
    }, function errorCallback(response){
      console.log('Error! '+ JSON.stringify(response.body));
    });
  }


  // Topic creation section
  $scope.newTopic = {
      title: "",
      dest: $scope.destination.id
  };
  $scope.invalidText = function() {
    return ($scope.newTopic.title=="");
  }

  $scope.createTopic = function() {
    console.log(`Creating new topic: ${$scope.newTopic}`);

    $http({
      method: 'POST',
      url: '/api/topics/',
      data: $scope.newTopic,
      headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(response){
      console.log('Success! ' + response.data);
      $scope.getTopics();
      $scope.clearForm();
    }, function errorCallback(response){
      console.log('Error! '+ response.data);
    });

    $scope.clearForm = function(){
      $scope.newTopic.title = "";
    }
  }

  // Voting is handled by the server.
  $scope.vote = function(index, vote) {
    console.log(`Voting: ${vote} to id:${$scope.topics[index].id}`);
    $http({
      method: 'POST',
      url: `/api/topics/${$scope.topics[index].id}/vote/`,
      data: {"vote": vote},
      headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(response){
      console.log('Success!');
      $scope.getTopics();
    }, function errorCallback(response){
      console.log('Error! '+ response.headers);
    });
  }

  $scope.delete = function(index){
    console.log(`Deleting topic called ${$scope.topics[index].value.title}`);
    $http({
      method: 'DELETE',
      url: `/api/topics/${$scope.topics[index].id}`,
      headers: {'Content-Type': 'application/json'}
    }).then(function successCallback(response){
      console.log('Success, deleted.');
      $scope.getTopics();
    }, function errorCallback(response){
      console.log('Error! '+ JSON.stringify(response.body));
    });
  }

  // First check if the user has logged in yet!
  if(current.checkLogin()){
    $scope.username = current.user.username;
    // This makes the call
    $scope.getTopics();
  };

})

.directive('topicPrvw', function(){
  return{
    scope: {
      info: '=',
      index: '@'
    },
    templateUrl: 'app/destinations/topicPreview.html'
  };
})

.directive('crtTopic', function(){
  return{
    scope: false,
    templateUrl: 'app/destinations/topicCreate.html'
  };
});
