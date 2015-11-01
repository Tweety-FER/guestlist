(function() {
  'use strict';

  angular.module('kset.guestlist.form', [
    'kset.guestlist.auth.principal',
    'ngResource'
  ]).controller('FormController', FormCtrl);

  FormCtrl.$inject = ['$resource', '$auth', '$http'];

  function FormCtrl($resource, $auth, $http) {
    var self = this;

    $http.defaults.headers.common['token'] = $auth.getToken();

    var res = $resource('/api/guest/:id', {'id' : '@id'}, {
      massSave : {
        method : 'POST',
        url : '/api/guests',
        isArray : true
      }
    });

    self.guest = {};
    self.add = add;
    self.error = '';
    var busy = false;

    function add() {
      if(busy) {
        return;
      }

      if(!!self.guest.fullName) {
        busy = true;
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

    function afterSave() {
      self.error = '';
      self.guest.fullName = '';
      self.guest.referrer = '';
      busy = false;
    }

    function failedSave() {
      busy = false;
      self.error = 'Unos nije uspio! Provjerite podatke!';
    }
  }

}());
