(function() {
  'use strict';

  angular.module('kset.guestlist', [
            'ngResource',
            'ui.router',
            'kset.guestlist.auth.principal',
            'kset.guestlist.navbar',
            'kset.guestlist.list',
            'kset.guestlist.form',
            'kset.guestlist.auth'
          ])
         .config(SetupRoutes)
         .run(Authorize);

  Authorize.$inject = ['$rootScope', '$auth'];

  function Authorize($rootScope, $auth) {
    $rootScope.$on('$stateChangeStart', function(e, toState) {
      if(toState.name !== 'auth') {
        $auth.guard(e);
      }
    });
  }

  SetupRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function SetupRoutes(state, url) {
    url.otherwise('/auth');

    state
    .state('index', {
      templateUrl : 'partials/index.html',
      controller : 'NavbarController',
      controllerAs : 'navbar'
    })
    .state('index.list', {
      url : '/guestlist',
      templateUrl : 'partials/list.html',
      controller : 'ListController',
      controllerAs : 'list'
    })
    .state('index.form', {
      url : '/admin',
      templateUrl : 'partials/form.html',
      controller : 'FormController',
      controllerAs : 'form'
    })
    .state('auth', {
      url : '/auth',
      templateUrl : 'partials/login.html',
      controller : 'AuthController',
      controllerAs : 'auth'
    });
  }

}());
