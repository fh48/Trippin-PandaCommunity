angular.module('tpanda.main', ['ui.bootstrap'])
    .controller('MainCtrl', function($scope, $http, $location, $window, current, pandatars){

      $scope.taglines = ["Your friendly retro trip-advisor", "Cos trippin's trippin'", "Time to leave the lab", "I'm a compsci, get me outta here", "Should we implement a useful feature?", "PANDA to your ambitions", "It's pandamonium out there.", "Trippin' is pandatory"];

      // Array to hold destinations available
      $scope.destinations = [];

      $scope.avatar = pandatars.getPandaLink(current.user.avatar);

      //Here, define the call to get the list of destinations available
      $scope.getDestinations = function(){
        $http({
          method: 'GET',
          url: '/api/destinations/'
        }).then(function successCallback(response){
          console.log(`Success! Retrieved ${(response.data.length)} destinations!`);

          $scope.destinations = response.data;
          $scope.generateLinks();
        }, function errorCallback(response){
          console.log('Error! '+ response.data);
        });
      }

      // Generates onwards links for each destination to its respective topic page
      $scope.generateLinks = function(){
        for(let i=0; i<$scope.destinations.length; i++){
          $scope.destinations[i].path = `/#!/destinations/${$scope.destinations[i].id}`
          //console.log(`${$scope.destinations[i].value.name} got link ${$scope.destinations[i].path}`)
        }
      }

      // Stores the data in the current service to allow forward and back navigation
      $scope.updateCurrent = function(index){
        current.setDestination($scope.destinations[index]);
        // console.log(current.destination.value.name);
      }

      // Destination creation
      $scope.newDest = {
        name: "",
        country: "",
        img: ""
      }

      $scope.invalidText = function() {
        for(var prop in $scope.newDest){
          if($scope.newDest[prop]== ""){
            return true;
          }
        }
        return false;
      }

      $scope.createDest = function() {
        // console.log("creating destination, object = "+JSON.stringify($scope.newDest));
        console.log("test");
        // Make the destination creation call, and then with the response, reload the page!
        $http({
          method: 'POST',
          url: '/api/destinations/',
          data: $scope.newDest,
          headers: {'Content-Type': 'application/json'}
        }).then(function successCallback(response){
          console.log('Success! ' + response.data);
          $scope.getDestinations();
          $scope.clearForm();
        }, function errorCallback(response){
          console.log('Error! '+ response.data);
        });

        $scope.clearForm = function(){
          for(var prop in $scope.newDest){
            $scope.newDest[prop] = "";
          }
        }
      }

      // First check if the user has logged in yet!
      if(current.checkLogin()){
        $scope.username = current.user.username;
        // This makes the call
        $scope.getDestinations();
      };

      $scope.tagline = $scope.taglines[Math.floor(Math.random()*$scope.taglines.length)];

      })

      .directive('destPrvw', function(){
        return{
          scope: {
            info: '=',
            index: '@'
          },
          templateUrl: 'app/main/destPreview.html'
        };
      })

      .directive('crtDest', function(){
        return{
          scope: false,
          templateUrl: 'app/main/destCreate.html'
        };
      });
