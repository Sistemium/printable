'use strict';

(function () {

  function VisitMapService($q, Schema) {

    let {VisitReport, VisitMapReport} = Schema.models();

    return {getRoutes, saveReportData};

    function saveReportData(date, salesmanId, reportData) {

      return VisitMapReport.findAll({date, salesmanId})
        .then(_.first)
        .then(found => {

          let cnt = reportData.length;
          let legalEntityId = _.first(reportData).employerLegalEntityId;

          found = found || VisitMapReport.createInstance({date, salesmanId});

          return _.assign(found, {cnt, reportData, legalEntityId})
            .DSCreate();

        });

    }

    function getRoutes(date, salesmanId) {

      return VisitReport.findAll({date, salesmanId}, {cacheResponse: false, bypassCache: true})
        .then(visits => {
          return _.sortBy(visits, 'start.timestamp');
        });

    }

  }

  angular.module('streports')
    .service('VisitMapService', VisitMapService);

})();
