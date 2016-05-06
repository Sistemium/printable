export function routerConfig(stateHelperProvider, $urlRouterProvider) {
  'ngInject';
  stateHelperProvider
    .state({
        name: 'root',
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
        children: [
          {
            name: 'accessToken',
            abstract: true,
            url: '/{accessToken}/p',
            children: [
              {
                name: 'shipmentRoutes',
                url: '/shipmentRoutes',
                templateUrl: 'app/main/reports/shipmentRoutes.html',
                controller: 'ShipmentRoutes',
                controllerAs: 'vm'
              }
            ]
          }
        ]
      }
    )
  ;

  $urlRouterProvider.otherwise('/');
}
