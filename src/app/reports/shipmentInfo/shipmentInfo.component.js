(function () {

  angular.module('streports')
    .component('shipmentInfo', {

      bindings: {},
      templateUrl: 'app/reports/shipmentInfo/shipmentInfo.html',
      controllerAs: 'vm',
      controller: shipmentInfoController

    });

  function shipmentInfoController($scope, $state, Schema, $q) {

    const vm = this;
    const { Shipment, ShipmentPosition } = Schema.models();

    _.assign(vm, {});

    /*
     Init
     */

    getData($state.params.shipmentId);

    /*
     Functions
     */


    function getData(shipmentId) {

      vm.isLoading = true;
      vm.busy = Shipment.find(shipmentId)
        .then(shipment => shipment.DSLoadRelations())
        .then(shipment => {
          vm.shipment = shipment;
          const { outlet } = shipment;
          return $q.when(outlet && outlet.DSLoadRelations())
            .then(() => ShipmentPosition.findAll({ shipmentId }));
        })
        .then(positions => $q.all(_.map(positions, position => position.DSLoadRelations())))
        .then(positions => {
          vm.positions = positions;
          vm.totalVolume = _.sumBy(positions, 'volume');
          vm.totalCost = _.sumBy(positions, ({ volume, price }) => volume * price);
          vm.totalCostDoc = _.sumBy(positions, ({ volume, priceDoc }) => volume * priceDoc);
        });

    }


  }

})();
