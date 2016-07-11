(function () {

  'use strict';

  angular.module('streports')
    .controller('PickingOrderBarcodesController', function ($http) {

      var vm = this;

      $http.get('https://api.sistemium.com/v4d/dev/pickingOrderBarcodeSample', {
        params: {
          pickingOrderId: '8f9c3934-42b9-11e6-8000-e188647b398f'
        }
      }).then(function (response) {
        vm.pickingOrderBarcodes = response.data;
        vm.printReady = true;
      }).catch((function (err) {
        console.log(err);
      }))

    })

})();
