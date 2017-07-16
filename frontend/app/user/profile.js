angular.module('tpanda.user', ['ui.bootstrap'])
    .controller('UserCtrl', function($scope, $http, $location, current, pandatars){
      $scope.user;

      $scope.selectedIndex;

      $scope.selectPanda = function(index){
        console.log("selecting panda "+index);
        $scope.selectedIndex = index;
      }

      $scope.pandatars = [];
      $scope.getPandatars = function(){
        for(let i=0; i<pandatars.pandas.length; i++){
          // This line is here just for entertainment purposes
          $scope.pandatars.push(pandatars.pandapath+pandatars.pandas[i]);
        }
      }
      $scope.getPandatars();

      $scope.getUser = function(){
        $http({
          method: 'GET',
          url: `/api/users/`
        }).then(function successCallback(response){
          $scope.user = response.data;
          $scope.selectedIndex = $scope.user.avatar;
          console.log(`Success, received user: ${JSON.stringify($scope.user)}`);
        }, function errorCallback(response){
          console.log('Error! '+ response.data);
        });
      }

      $scope.updateAvatar = function(){
        if($scope.selectedIndex!=$scope.user.avatar){
          $http({
            method: 'PATCH',
            url: `/api/users/`,
            data: { newValue : $scope.selectedIndex }
          }).then(function successCallback(response){
            console.log(`Success, avatar changed`);
          }, function errorCallback(response){
            console.log('Error! '+ response.data);
          });
        }
      }

      $scope.deleteProfile = function(){
        $http({
          method: 'DELETE',
          url: `/api/users/`
        }).then(function successCallback(response){
          console.log(`Success, user deleted... :(`);
          current.logOut();
        }, function errorCallback(response){
          console.log('Error! '+ response.data);
        });
      }

      if(current.checkLogin()){
        $scope.getUser();
      };
    })

    .directive('pandatar', function(){
      return{
        scope: {
          panda: '=',
          index: '@'
        },
        template : `<img class=panda-pic ng-src='{{panda}}' ng-class='{selected : index==$parent.selectedIndex}' ng-click='$parent.selectPanda(index); $parent.updateAvatar()'/>`
      };
    })

    ;
