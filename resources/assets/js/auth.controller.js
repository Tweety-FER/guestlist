(function() {
  'use strict';

  angular.module('kset.guestlist.auth', [])
         .controller('AuthController', Auth);

   Auth.$inject = ['$auth', '$state'];

   function Auth(auth, $state) {
     var self = this;

     self.loginData = {};
     self.registerData = {};
     self.login = login;
     self.error = '';

     function success() {
       $state.go('index.list');
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
   }
}());
