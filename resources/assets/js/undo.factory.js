(function() {
  'use strict';
  angular.module('kset.guestlist.history', [])
         .factory('$history', History);

  function History() {
      var history = [];

      var undoer = {
        length : length,
        push : push,
        undo : undo
      };

      return undoer;

      function length() {
        return history.length;
      }

      function push(op) {
        history.push(op);
      }

      function undo() {
        if(history.length > 0) {
          var op = history.pop();

          op();
        }
      }
  }

}());
