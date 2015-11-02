(function() {
  'use strict';

  angular.module('kset.guestlist.modal.controller', [
    'ui.bootstrap'
  ]).controller('ModalController', Modal);

  Modal.$inject = ['$uibModalInstance', 'message'];

  function Modal(instance, message) {
    var self = this;

    self.message = message;

    self.ok = ok;
    self.cancel = cancel;

    function ok() {
      instance.close(true);
    }

    function cancel() {
      instance.close(false);
    }
  }

}());
