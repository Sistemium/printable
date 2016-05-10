(function () {
  'use strict';

  angular.module('streports')
    /** @ngInject */
    .controller('ShipmentRoutesController', function ShipmentRoutesController(ShipmentRoutesInitService, $state, $log) {
      'ngInject'

      var vm = this;
      vm.data = [];
      vm.printReady = false;
      vm.state = {
        at: $state.params.accessToken
      };

      function init() {
        ShipmentRoutesInitService.then(function (response) {
          vm.data = response.data;
          vm.printReady = true;
        }, function (response) {
          $log.error(response);
          vm.printReady = true;
        });
      }

      init();
    })
  ;
})();
