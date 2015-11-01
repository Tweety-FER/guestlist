(function() {
  'use strict';

  angular.module('kset.guestlist.navbar', [
    'kset.guestlist.history',
    'kset.guestlist.auth.principal',
    'ui.router'
  ]).controller('NavbarController', Navbar);

  Navbar.$inject = ['$state', '$history', '$auth'];

  function Navbar($state, $history, $auth) {
    var self = this;

    self.admin = $auth.amAdmin();
    self.history = $history;
    self.getActive = getActive;
    self.logout = logout;

    function getActive() {
      return $state.current.name;
    }

    function logout() {
      $auth.logout();
      $state.go('auth');
    }
  }

}());
