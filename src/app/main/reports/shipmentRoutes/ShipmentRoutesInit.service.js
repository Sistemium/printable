(function () {
  'use strict';

  angular.module('streports')
    /** @ngInject */
    .service('ShipmentRoutesInitService', function ShipmentRoutesInitService($http, $state) {
      return $http({
        method: 'GET',
        url: 'https://r50.sistemium.com/api2/jsd/dr50/ShipmentRoute',
        headers: {
          authorization: $state.params.accessToken
        }
      });
    })
  ;
})();
