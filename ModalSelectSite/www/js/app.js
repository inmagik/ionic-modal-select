// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', 
  ['ionic', 'starter.controllers', 'ngSanitize', 'btford.markdown', 'ionic-modal-select', 'ui.ace',  'ngSanitize'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, markdownConverterProvider) {

  markdownConverterProvider.config({
    extensions: ['github']
  });


  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
      }
    }
  })

  .state('app.api', {
      url: '/api',
      views: {
        'menuContent': {
          templateUrl: 'templates/api.html'
        }
      }
    })
  .state('app.examples', {
    url: '/examples',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/examples.html',
        controller: 'ExamplesCtrl'
      }
    }
  })

  .state('app.examples-rendering', {
    url: '/examples-rendering',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/examples-rendering.html',
        controller: 'ExamplesCtrl'
      }
    }
  })

  .state('app.examples-search', {
    url: '/examples-search',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/examples-search.html',
        controller: 'ExamplesCtrl'
      }
    }
  })

  .state('app.examples-callbacks', {
    url: '/examples-callbacks',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/examples-callbacks.html',
        controller: 'ExamplesCtrl'
      }
    }
  })



  .state('app.examples-styling', {
    url: '/examples-styling',
    cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/examples-styling.html',
        controller: 'ExamplesCtrl'
      }
    }
  });

  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
