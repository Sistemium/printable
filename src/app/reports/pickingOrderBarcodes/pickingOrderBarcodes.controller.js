(function () {

  'use strict';

  angular.module('streports')
    .controller('PickingOrderBarcodesController', function ($http, $state, $log) {

      var vm = this;

      $http.get('https://api.sistemium.com/v4d/bs/pickingOrderBarcodeSample', {
        params: {
          pickingOrderId: $state.params.id,
          'x-page-size:': 1000,
          'x-order-by:': 'name'
        }
      }).then(function (response) {
        vm.pickingOrderBarcodes = response.data;
        vm.printReady = true;
      }).catch((function (err) {
        $log.error(err);
      }))

    })

})();
