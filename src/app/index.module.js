(function () {
  'use strict';

  angular
    .module('streports', [
      'ui.router',
      'ui.router.stateHelper',
      'jsd',
      'yaMap',
      'angularMoment',
      'io-barcode'
    ]);

  angular
    .module('jsd', ['sistemium']);

})();
