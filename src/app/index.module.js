import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { ShipmentRoutesController } from './main/reports/shipmentRoutes/shipmentRoutes.controller';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';

angular.module('streports', ['ui.router', 'ui.router.stateHelper'])
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .controller('MainController', MainController)
  .controller('ShipmentRoutesController', ShipmentRoutesController)
  .directive('acmeNavbar', NavbarDirective);
