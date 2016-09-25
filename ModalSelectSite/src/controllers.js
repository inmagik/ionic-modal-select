angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $ionicScrollDelegate) {

  $scope.toAnchor = function(anchor) {
    $location.hash(anchor);
    $ionicScrollDelegate.anchorScroll(true);
  };

})


.controller('ExamplesCtrl', function($scope, $timeout, $ionicScrollDelegate) {

  $scope.someModel = null;
  $scope.secondModel = null;
  $scope.selectables = [
    1, 2, 3
  ];

  $scope.longList  = [];
  for(var i=0;i<1000; i++){
    $scope.longList.push(i);
  }

  $scope.selectableNames =  [
    { name : "Mauro", role : "juggler"},
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

  //later options settings example
  $scope.changingOptions = [1,2,3];
  $scope.toggleChanging = function(){
    if ($scope.changingOptions.length == 3){
      $scope.changingOptions = [1,2,3,4,5,6,7,8,9,10];
    } else {
      $scope.changingOptions = [1,2,3];
    }
  };

  $scope.numbers = [1,2,3,4,5,6,7,8];

  $scope.shoutLoud = function(newValuea, oldValue){
    alert("changed from " + JSON.stringify(oldValue) + " to " + JSON.stringify(newValuea));
  };

  $scope.shoutReset = function(){
    alert("value was reset!");
  };

  $scope.shoutClose = function(){ alert("modal was closed!")}; 

  $scope.searchPropertiesSearchModel = null;


  $ionicScrollDelegate.scrollTop();


});
