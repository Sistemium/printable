(function () {
  'use strict';

  angular
    .module('streports')
    .run(function runBlock($log) {
      $log.debug('runBlock end');
    })
  ;
})();
