(function() {
  'use strict';

  angular.module('kset.guestlist.auth.principal', ['ui.router'])
         .factory('$auth', Auth);

   Auth.$inject = ['$http', '$state'];

   function Auth($http, $state) {
       var token = fromStorage('kset-token'),
           admin = fromStorage('kset-admin') || false;

       var auth = {
         getToken : function() {
           return token;
         },
         amAdmin : function() {
           if(angular.isString(admin)) {
             return admin === 'true';
           }

           return admin;
         },
         login : login,
         logout : logout,
         register : register,
         isAuthorized : isAuthorized,
         guard : guard
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

       function guard(transEvent) {
         if(!auth.isAuthorized()) {
           transEvent.preventDefault();
           $state.go('auth');
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

}());
