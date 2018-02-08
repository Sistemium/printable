'use strict';

(function () {

  function VisitMapService($q, Schema) {

    let {VisitReport} = Schema.models();

    return {getRoutes, saveReportData};

    function saveReportData() {
      // return ShipmentRoute.patch(shipmentRoute, {
      //   reportData: data
      // });
    }

    function getRoutes(vm, date, salesmanId) {

      return VisitReport.findAll({date, salesmanId}, {cacheResponse: false, bypassCache: true})
        .then(visits => {
          return _.sortBy(visits, 'start.timestamp');
        });

    }
  }

  angular.module('streports')
    .service('VisitMapService', VisitMapService);

})();
