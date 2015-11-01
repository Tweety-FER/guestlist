(function() {
  'use strict';

  angular.module('kset.guestlist.auth', [])
         .controller('AuthController', Auth);

   Auth.$inject = ['$auth', '$state', '$scope'];

   function Auth(auth, $state, $scope) {
     var self = this;

     self.showRegister = false;
     self.loginData = {};
     self.registerData = {};
     self.login = login;
     self.register = register;
     self.error = '';

     if(!document.toggleRegister) {
       document.toggleRegister = function() {
         $scope.$apply(function() {
           self.showRegister = !self.showRegister;
         });
       }
     }

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
