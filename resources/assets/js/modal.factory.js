(function() {
  'use strict';

  angular.module('kset.guestlist.modal', ['kset.guestlist.modal.controller'])
         .factory('$confirm', Confirm);

  Confirm.$inject = ['$uibModal'];

  function Confirm($uibModal) {
    return function(callback, text) {
      var instance = $uibModal.open({
        templateUrl : 'partials/confirm.html',
        controller : 'ModalController',
        controllerAs : 'modal',
        resolve : {
          message : function() {
            return text;
          }
        }
      });

      instance.result.then(function (status) {
        if(status === true) {
          callback();
        }
      });
    }
  }
}());
