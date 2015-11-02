(function() {
  'use strict';

  angular.module('kset.guestlist.list', [
    'kset.guestlist.history',
    'kset.guestlist.auth.principal',
    'kset.guestlist.modal',
    'ngResource'
  ]).controller('ListController', List);

  List.$inject = ['$history', '$resource', '$auth', '$http', '$confirm'];

  function List($history, $resource, $auth, $http, $confirm) {
    var self = this;

    $http.defaults.headers.common['token'] = $auth.getToken();

    var res = $resource('/api/guest/:id', {'id' : '@id'}, {
      update : {
        method : 'PUT'
      }
    });

    self.admin = $auth.amAdmin();
    self.guests = [];
    // DO NOT show checked people by default
    self.query = { checked : false };
    self.toggleCheck = toggleCheck;
    self.toggleFilter = toggleFilter;
    self.remove = remove;

    //Load the user list when the page opens
    load();

    function load() {
      res.query(function(guests) {
        self.guests = [];

        //Transform the stupid ints into bools
        angular.forEach(guests, function(guest) {
            guest.checked = guest.checked === '1' ? true : false;
            self.guests.push(guest);
        });
      });
    }

    function toggleFilter() {
      self.query.checked = !self.query.checked;
    }

    function toggleCheck(guest, noUndo) {
      var action = guest.checked ? 'Checkoutaj' : 'Checkinaj';

      //Require a confirmation
      $confirm(function() {
        performCheckToggle(guest, noUndo)
      }, action + ' osobu ' + guest.fullName + '?');
    }

    function performCheckToggle(guest, noUndo) {
      guest.checked = !guest.checked;

      res.update(guest, function() {
        //If this isn't an undo, push an undo operation into the history stack
        if(noUndo !== true) {
          $history.push(function() {
            performCheckToggle(guest, true);
          });
        }

        load();
        self.query.fullName = '';
        self.query.referrer = '';
      });
    }

    function remove(guest) {
      console.log('DEBUG', guest);
      $confirm(function() {
        res.delete({id : guest.id}, load);
      }, 'Makni osobu ' + guest.fullName + ' s popisa?');
    }
  }

}());
