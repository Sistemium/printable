(function () {
  'use strict';

  angular.module('streports')
    .controller('ShipmentRouteReportModalController', ShipmentRouteReportModalCtrl);

  function ShipmentRouteReportModalCtrl(mapsHelper, $timeout, $log, $state, ShipmentRouteService) {

    var vm = this;
    var readyDelay = 1000;
    var saveData = angular.isDefined($state.params.saveData);

    angular.extend(vm, {

      mapOptions: {
        avoidFractionalZoom: false,
        margin: 0,
        balloonAutoPanMargin: 0
      },

      trackInit: function () {
        setReady('trackReady');
      },

      markersInit: function () {
        setReady('markersReady');
      },

      startMarkerInit: function () {
        setReady('startMarkerReady');
      }

    });

    /*
     Init
     */

    getData($state.params.id);

    /*
     Functions
     */

    function setReady(code) {
      $log.info('setReady:', code);
      return $timeout(function () {
        vm[code] = true;
      }, readyDelay);
    }

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
              var firstCheckinCoordinates = _.get(_.first(vm.markers), 'geometry.coordinates');

              if (firstCheckinCoordinates && routeStart) {
                routeStart.isCheckin = mapsHelper.distanceFn(yaLatLng(routeStart), firstCheckinCoordinates) <= 25;
              }

              if (!routeStart.isCheckin) {
                vm.startMarker = mapsHelper.yMarkerConfig({
                  id: 'routeStart',
                  location: routeStart,
                  content: 'Старт',
                  hintContent: moment(routeStart.timestamp + ' Z').format('HH:mm')
                });
              } else {
                vm.startMarkerInit();
              }

            }


          }

        }

      }

    }

    function getData(shipmentRoute) {

      vm.isLoading = true;

      function stopLoading(error) {
        vm.isLoading = false;
        if (error) {
          vm.errorReady = error;
        }
      }

      vm.locations = [];
      vm.rawLocations = [];

      vm.busy = ShipmentRouteService.getRoutes(vm, shipmentRoute);

      vm.busy.then(function (routePoints) {

        vm.data = _.sortBy(_.filter(routePoints, 'reachedAtLocation'), 'reachedAt.timestamp');

        let reportData = _.map(vm.data, point => {
          return {
            id: point.id,
            reachedAtTimestamp: _.get(point, 'reachedAt.timestamp'),
            shipment: point.shipment,
            name: point.name
          }
        });

        reportData = {
          driver: {
            name: _.get(vm.shipmentRoute, 'drivenBy.fullName'),
            truckBrand: _.get(vm.shipmentRoute, 'drivenBy.truckBrand'),
            truckNumber: _.get(vm.shipmentRoute, 'drivenBy.truckNumber')
          },
          routePoints: reportData
        };

        if (saveData) {
          return ShipmentRouteService.saveReportData(shipmentRoute, reportData);
        }

      })
        .then(()=>{
          stopLoading();
          initMap();
        })
        .catch(stopLoading);

    }

  }

})();

