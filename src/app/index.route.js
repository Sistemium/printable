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
                controllerAs: 'vm'
              },
              {
                name: 'shipmentRouteReportModal',
                url: '/srrm/{id}',
                templateUrl: 'app/main/reports/shipmentRouteReportModal/shipmentRouteReportModal.html',
                controller: 'ShipmentRouteReportModalController',
                controllerAs: 'ctrl'
              }
            ]
          }
        )
      ;

      $urlRouterProvider.otherwise('/');
    });
})();
