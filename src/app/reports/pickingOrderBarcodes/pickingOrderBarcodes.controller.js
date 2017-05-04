(function () {

  'use strict';

  angular.module('streports')
    .controller('PickingOrderBarcodesController', function ($state, $log, Schema) {

      const vm = this;
      const {PickingOrderBarcodeSample} = Schema.models();

      PickingOrderBarcodeSample.findAll({
        pickingOrderId: $state.params.id
      }).then(function (data) {
        vm.pickingOrderBarcodes = data;
        vm.printReady = true;
      }).catch((function (err) {
        $log.error(err);
      }))

    })

})();
