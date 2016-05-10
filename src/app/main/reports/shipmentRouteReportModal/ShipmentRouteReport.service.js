(function (ng) {
  'use strict';

  ng.module('streports')
    .service('ShipmentRouteService', function ($q, Schema) {
      var ShipmentRoute = Schema.model('ShipmentRoute');
      var ShipmentRoutePoint = Schema.model('ShipmentRoutePoint');
      var Location = Schema.model('Location');

      return function (vm, shipmentRoute) {
        return $q(function (resolve, reject) {
          ShipmentRoute.find(shipmentRoute)
            .then(function (sr) {

              vm.shipmentRoute = sr;

              Location.findAll({
                shipmentRoute: sr.id
              }, {cacheResponse: false, bypassCache: true}).then(function (data) {
                vm.rawLocations = data;
                ShipmentRoute.loadRelations(sr, ['ShipmentRoutePoint'], {bypassCache: true}).then(function () {

                  vm.shipmentRoutePoints = sr.points;

                  $q.all(_.map(vm.shipmentRoutePoints, function (i) {
                    return ShipmentRoutePoint.loadRelations(i, ['Location'])
                      .then(function (rp) {
                        return rp;
                      });
                  })).then(resolve, reject);
                }, reject);


              }, reject);
            })
            .catch(function (res) {
              vm.serverError = res;
            });
        });
      };
    })
  ;

})(angular);
