'use strict';

(function () {

  function ShipmentRoutesController($state, Schema, $log, ImageHelper, $q) {

    let vm = this;
    let ShipmentRoute = Schema.model('ShipmentRoute');

    _.assign(vm, {
      authorName: 'Бухгалтерова И.В.'
    });

    init($state.params.date);

    function init(date) {

      $log.info('ShipmentRoutesController.init', date);

      ShipmentRoute.findAll({date}, {cacheResponse: false})
        .then(data => {
          $log.info('ShipmentRoute.data.length:', data.length);
          vm.data = _.filter(data, 'mapSrc');
          return $q.all(_.map(vm.data, (route, idx) => {

            _.each(route.reportData.routePoints, point => {
              point.title = _.last(point.name.match(/([^\(]+) \(/));
            });

            return ImageHelper.loadImage(route.mapSrc)
              .then(img => {
                _.set(route, 'map.src', img.src);
                $log.info('Got image #' + idx);
              })
          }));
        })
        .then(() => vm.printReady = true)
        .catch(error => {
          $log.error(error);
          vm.errorReady = true;
        });

    }

  }

  angular.module('streports')
    .controller('ShipmentRoutesController', ShipmentRoutesController);

})();
