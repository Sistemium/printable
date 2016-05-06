export function routerConfig(stateHelperProvider, $urlRouterProvider) {
  'ngInject';
  stateHelperProvider
    .state({
        name: 'root',
        url: '/{accessToken}',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',

        //name: 'accessToken',
        //abstract: true,
        //url: '/{accessToken}/p',
        children: [
          {
            name: 'shipmentRoutes',
            url: '/p',
            templateUrl: 'app/main/reports/shipmentRoutes/shipmentRoutes.html',
            controller: 'ShipmentRoutesController',
            controllerAs: 'vm'
          }
        ]
      }
    )
  ;

  $urlRouterProvider.otherwise('/');
}
