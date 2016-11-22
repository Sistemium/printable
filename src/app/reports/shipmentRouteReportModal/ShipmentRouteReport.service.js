'use strict';

(function () {

  function ShipmentRouteService($q, Schema) {

    let ShipmentRoute = Schema.model('ShipmentRoute');
    let ShipmentRoutePoint = Schema.model('ShipmentRoutePoint');
    let Location = Schema.model('Location');

    return {getRoutes, saveReportData};

    function saveReportData(shipmentRoute, data) {
      return ShipmentRoute.patch(shipmentRoute, {
        reportData: data
      });
    }

    function getRoutes(vm, shipmentRoute) {
      return ShipmentRoute.find(shipmentRoute)
        .then(function (sr) {

          vm.shipmentRoute = sr;

          return Location.findAll({shipmentRoute: sr.id}, {cacheResponse: false, bypassCache: true})
            .then(function (data) {
              vm.rawLocations = _.filter(data, {source: null});
              return ShipmentRoute.loadRelations(sr, ['ShipmentRoutePoint', 'Driver'], {bypassCache: true})
                .then(function () {
                  vm.shipmentRoutePoints = _.filter(sr.points, 'shipment.ndocs.length');
                  return $q.all(_.map(vm.shipmentRoutePoints, i => {
                    return ShipmentRoutePoint.loadRelations(i, ['Location']);
                  }));
                });
            });
        })
        .catch(function (res) {
          vm.serverError = res;
        });

    }
  }

  angular.module('streports')
    .service('ShipmentRouteService', ShipmentRouteService);

})();
