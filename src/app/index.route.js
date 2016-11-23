(function () {
  'use strict';

  angular
    .module('streports')
    .config(function (stateHelperProvider, $urlRouterProvider) {
      stateHelperProvider
        .state({
            name: 'root',
            url: '/{accessToken}/{pool}',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main',

            children: [
              {
                name: 'shipmentRoutes',
                url: '/shipmentRoutes/:date',
                templateUrl: 'app/reports/shipmentRoutes/shipmentRoutes.html',
                controller: 'ShipmentRoutesController',
                controllerAs: 'vm'
              },
              {
                name: 'shipmentRouteReportModal',
                url: '/srrm/{id}?saveData',
                templateUrl: 'app/reports/shipmentRouteReportModal/shipmentRouteReportModal.html',
                controller: 'ShipmentRouteReportModalController',
                controllerAs: 'ctrl'
              },
              {
                name: 'pickingOrderBarcodes',
                url: '/pob/{id}',
                templateUrl: 'app/reports/pickingOrderBarcodes/pickingOrderBarcodes.html',
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
