angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('ExamplesCtrl', function($scope, $timeout) {

  $scope.selectables = [
    1, 2, 3
  ];

  $scope.longList  = [];
  for(var i=0;i<1000; i++){
    $scope.longList.push(i);
  }

  $scope.selectableNames =  [
    { name : "Mauro", role : "navigator"}, 
    { name : "Silvia", role : "chef"},
    { name : "Merlino", role : "little canaglia"},
  ];

  $scope.laterSelectables = ['some value'];
  $timeout(function(){
    $scope.laterSelectables = [1,2,3,4,5];
  }, 1000);

  $scope.someSetModel = 'Mauro';

  $scope.getOpt = function(option){
    return option.name + ":" + option.role;
  };

  $scope.shoutLoud = function(newValuea, oldValue){
    alert("changed from " + JSON.stringify(oldValue) + " to " + JSON.stringify(newValuea));
  };

  $scope.shoutReset = function(){
    alert("value was reset!");
  };



});
