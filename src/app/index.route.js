(function () {
  'use strict';

  angular
    .module('streports')
    .config(function (stateHelperProvider, $urlRouterProvider) {
      stateHelperProvider
        .state({
            name: 'root',
            url: '/{accessToken}',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main',

            children: [
              {
                name: 'shipmentRoutes',
                url: '/p',
                templateUrl: 'app/main/reports/shipmentRoutes/shipmentRoutes.html',
                controller: 'ShipmentRoutesController',
                controllerAs: 'ctrl'
              },
              {
                name: 'shipmentRouteReportModal',
                url: '/srrm/{id}',
                templateUrl: 'app/main/reports/shipmentRouteReportModal/shipmentRouteReportModal.html',
                controller: 'ShipmentRouteReportModalController',
                controllerAs: 'ctrl'
              },
              {
                name: 'pickingOrderBarcodes',
                url: '/pob/{id}',
                templateUrl: 'app/main/reports/pickingOrderBarcodes/pickingOrderBarcodes.html',
                controller: 'PickingOrderBarcodesController',
                controllerAs: 'ctrl'
              }
            ]
          }
        )
      ;

      $urlRouterProvider.otherwise('/');
    });
})();
