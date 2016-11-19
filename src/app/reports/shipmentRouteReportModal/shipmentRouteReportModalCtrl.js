(function () {
  'use strict';

  angular.module('streports')
    .controller('ShipmentRouteReportModalController', ShipmentRouteReportModalCtrl);

  function ShipmentRouteReportModalCtrl(mapsHelper, $timeout, $log, $state, ShipmentRouteService) {
    var vm = this;

    vm.mapOptions = {
      avoidFractionalZoom: false,
      margin: 0,
      balloonAutoPanMargin: 0
    };

    function yaLatLng(location) {
      return mapsHelper.yLatLng(location);
    }

    function initMap() {

      if (!(vm.data && vm.data.length)) {
        vm.map = false;
        vm.markers = false;
        return;
      }

      Array.prototype.push.apply(vm.rawLocations, _.map(vm.data, function (rp) {
        rp.reachedAt.isCheckin = true;
        return rp.reachedAt;
      }));

      var bounds = mapsHelper.bounds(vm.rawLocations);

      vm.map = {
        yaCenter: yaLatLng(bounds.center),
        afterMapInit: afterMapInit
      };

      function afterMapInit(mapObj) {

        mapObj.setBounds(
          [yaLatLng(bounds.southwest), yaLatLng(bounds.northeast)],
          {
            checkZoomRange: true,
            preciseZoom: true,
            zoomMargin: [40, 30, 20, 40]
          }
        ).then(onMapReady);

        function onMapReady() {

          var clusters = [];
          var pixelCoordsFn = mapsHelper.yPixelCoords(mapObj);

          var lastCoords;

          _.each(vm.data, function (rp, idx) {
            var pixelCoords = pixelCoordsFn(rp.reachedAt);

            if (!lastCoords || mapsHelper.yPixelDistance(lastCoords, pixelCoords) > 55) {
              clusters.push({
                location: rp.reachedAt,
                labels: [idx + 1],
                hints: [rp.name]
              });
              lastCoords = pixelCoords;
            } else {
              var cluster = _.last(clusters);
              cluster.labels.push(idx + 1);
              cluster.hints.push(rp.name);
            }

          });

          $timeout(loadData, 500);

          function loadData() {

            vm.markers = [];

            _.each(clusters, function (cluster, idx) {
              vm.markers.push(mapsHelper.yMarkerConfig({
                id: idx + 1,
                location: cluster.location,
                content: cluster.labels.join(', '),
                hintContent: cluster.labels.join(', ')
              }));
            });

            if (vm.rawLocations.length) {

              var locs = _.sortBy(vm.rawLocations, 'timestamp');
              var fl = locs[0];
              var lastLocation = yaLatLng(fl);

              vm.locations = [lastLocation];

              _.filter(locs, function (d) {
                var ll = yaLatLng(d);
                if (d.isCheckin || mapsHelper.distanceFn(ll, lastLocation) > 20) {
                  vm.locations.push(lastLocation = ll);
                }
              });

              vm.track = {
                geometry: {
                  type: 'LineString',
                  coordinates: vm.locations
                },
                properties: {
                  balloonContent: 'Марштут следования'
                }
              };

              var routeStart = _.first(locs);

              if (!routeStart.isCheckin) {
                vm.startMarker = mapsHelper.yMarkerConfig({
                  id: 'routeStart',
                  location: routeStart,
                  content: 'Старт',
                  hintContent: moment(routeStart.timestamp + ' Z').format('HH:mm')
                });
                $log.info(routeStart.timestamp);
              }

            }

          }

        }

      }

    }

    function getData(shipmentRoute) {

      vm.isLoading = true;

      function stopLoading() {
        vm.isLoading = false;
      }

      vm.locations = [];
      vm.rawLocations = [];

      vm.busy = ShipmentRouteService(vm, shipmentRoute);

      vm.busy.then(function (routePoints) {

        vm.data = _.sortBy(_.filter(routePoints, 'reachedAtLocation'), 'reachedAt.timestamp');
        stopLoading();
        initMap();

      }, stopLoading);

    }

    var readyDelay = 500;

    angular.extend(vm, {

      refresh: function () {
        getData($state.params.id);
      },

      trackInit: function () {
        $log.info('trackInit');
        $timeout(function () {
          vm.trackReady = true;
        }, readyDelay);
      },

      markersInit: function () {
        $log.info('markersInit');
        $timeout(function () {
          vm.markersReady = true;
        }, readyDelay);
      },

      startMarkerInit: function () {
        $log.info('startMarkerInit');
        $timeout(function () {
          vm.startMarkerReady = true;
        }, readyDelay);
      }

    });

    vm.refresh();

  }

})();

