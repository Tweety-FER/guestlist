(function() {
  'use strict';

  angular.module('kset.guestlist', ['ngResource', 'ui.router'])
         .factory('auth', Auth)
         .factory('check', Check)
         .config(SetupRoutes)
         .run(Authorize)
         .controller('IndexController', IndexCtrl)
         .controller('AuthController', AuthCtrl);

  Auth.$inject = ['$http'];

  function Auth($http) {
      var token = fromStorage('kset-token'),
          admin = fromStorage('kset-admin') || false;

      var auth = {
        getToken : function() {
          return token;
        },
        amAdmin : function() {
          return admin;
        },
        login : login,
        logout : logout,
        register : register,
        isAuthorized : isAuthorized
      };

      return auth;

      function toStorage(name, value) {
        if(typeof Storage !== 'undefined') {
          localStorage.setItem(name, value);
        }
      }

      function fromStorage(name) {
        if(typeof Storage !== 'undefined') {
          return localStorage.getItem(name);
        }
      }

      function purgeStorage() {
        if(typeof Storage !== 'undefined') {
          localStorage.removeItem('kset-token');
          localStorage.removeItem('kset-admin');
        }
      }

      function login(email, password) {
        return $http.post('/api/login', {
                      email : email,
                      password : password
                    }).then(function(res) {
                      token = res.data.key;
                      admin = res.data.admin;
                      toStorage('kset-token', token);
                      toStorage('kset-admin', admin);
                      return true;
                    },function() {
                      token = undefined;
                      admin = false;
                      purgeStorage();
                      return false;
                    });
      }

      function register(name, email, password, passwordConfirmation) {
        return $http.post('/api/register', {
                      name : name,
                      email : email,
                      password : password,
                      'password_confirmation' : passwordConfirmation
                    }).then(function(res) {
                      token = res.data.key;
                      admin = res.data.admin;
                      toStorage('kset-token', token);
                      toStorage('kset-admin', admin);
                      return true;
                    },function() {
                      token = undefined;
                      admin = false;
                      purgeStorage();
                      return false;
                    });
      }

      function logout() {
        token = undefined;
        purgeStorage();
      }

      function isAuthorized() {
        return angular.isDefined(token);
      }
  }

  Check.$inject = ['auth', '$state']

  function Check(auth, $state) {
    return function(e) {
      if(!auth.isAuthorized()) {
        e.preventDefault();
        $state.go('auth');
      }
    }
  }

  Authorize.$inject = ['$rootScope', 'check'];

  function Authorize($rootScope, check) {
    $rootScope.$on('$stateChangeStart', function(e, toState) {
      if(toState.name !== 'auth') {
        check(e);
      }
    });
  }

  SetupRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function SetupRoutes(state, url) {
    url.otherwise('/auth');

    state
    .state('index', {
      url : '/index',
      templateUrl : 'partials/index.html',
      controller : 'IndexController',
      controllerAs : 'index'
    })
    .state('auth', {
      url : '/auth',
      templateUrl : 'partials/login.html',
      controller : 'AuthController',
      controllerAs : 'auth'
    });
  }

  IndexCtrl.$inject = ['$resource', 'auth', '$http', '$state'];

  function IndexCtrl($resource, auth, $http, $state) {
    var self = this;

    $http.defaults.headers.common['token'] = auth.getToken();

    var res = $resource('/api/guest/:id', {'id' : '@id'}, {
      update : {
        method : 'PUT'
      },
      massSave : {
        method : 'POST',
        url : '/api/guests',
        isArray : true
      }
    });

    self.admin = auth.amAdmin();

    console.log('Loaded admin status', self.admin);

    self.guest = {};
    self.guests = [];
    // DO NOT show checked people by default
    self.query = { checked : '0' };
    self.active = 'list';
    self.activate = activate;
    self.toggleCheck = toggleCheck;
    self.toggleFilter = toggleFilter;
    self.add = add;
    self.delete = remove;
    self.logout = logout;

    load();

    function load() {
      res.query(function(guests) {
        self.guests = guests;
      });
    }

    function remove(id) {
      res.delete({id : id}, load);
    }

    function activate(name) {
      self.active = name;
    }

    function logout() {
      auth.logout();
      $state.go('auth');
    }

    function add() {
      if(!!self.guest.fullName) {
        //If it's a list of guests, save all of them
        if(self.guest.fullName.indexOf(',') !== -1) {
          res.massSave({
            fullNames : self.guest.fullName,
            referrer : self.guest.referrer || ''
          }, afterSave, failedSave);
        } else {
          res.save(self.guest, afterSave, failedSave);
        }
      }
    }

    function toggleFilter() {
      self.query.checked = self.query.checked === '0' ? '1' : '0';
    }

    function toggleCheck(guest) {
      guest.checked = guest.checked === '0' ? true : false;
      res.update(guest, function() {
        load();
        self.query.fullName = '';
        self.query.referrer = '';
      });
    }

    function afterSave() {
      self.error = '';
      self.guest.fullName = '';
      self.guest.referrer = '';
      load();
    }

    function failedSave() {
      self.error = 'Unos nije uspio! Provjerite podatke!';
    }
  }

  AuthCtrl.$inject = ['auth', '$state'];

  function AuthCtrl(auth, $state) {
    var self = this;

    self.loginData = {};
    self.registerData = {};
    self.login = login;
    self.register = register;
    self.error = '';

    function success() {
      $state.go('index');
    }

    function failure() {
      self.error = 'Autorizacija nije uspjela';
    }

    function login() {
      auth.login(self.loginData.email, self.loginData.password).then(
        function(status) {
          status ? success() : failure();
        }, failure
      );
    }

    function register() {
      auth.register(
        self.registerData.name,
        self.registerData.email,
        self.registerData.password,
        self.registerData.passwordConfirmation
      ).then(
        function(status) {
          status ? success() : failure();
        }, failure
      );
    }
  }
}());
