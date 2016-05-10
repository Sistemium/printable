(function () {
  'use strict';

  angular.module('streports')
    .controller('ShipmentRouteReportModalController', function ShipmentRouteReportModalCtrl(Schema, $q, mapsHelper, $window, $timeout, $log) {
      var vm = this;
      var ShipmentRoute = Schema.model('ShipmentRoute');
      var ShipmentRoutePoint = Schema.model('ShipmentRoutePoint');
      var Location = Schema.model('Location');

      vm.mapOptions = {
        avoidFractionalZoom: false,
        margin: 0,
        balloonAutoPanMargin: 300
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
          afterMapInit: function (mapObj) {

            mapObj.setBounds(
              [yaLatLng(bounds.southwest), yaLatLng(bounds.northeast)],
              {
                checkZoomRange: true,
                preciseZoom: true,
                zoomMargin: [40, 30, 20, 40]
              }
            ).then(function () {

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

              $timeout(function () {
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

              });

            });

          }
        };

      }

      function getData(shipmentRoute) {

        vm.isLoading = true;

        function stopLoading() {
          vm.isLoading = false;
        }

        vm.locations = [];
        vm.rawLocations = [];

        vm.busy = $q(function (resolve, reject) {
          ShipmentRoute.find(shipmentRoute.id)
            .then(function (sr) {

              vm.shipmentRoute = sr;

              Location.findAll({
                shipmentRoute: sr.id
              }, {cacheResponse: false, bypassCache: true}).then(function (data) {
                vm.rawLocations = data;
                ShipmentRoute.loadRelations(sr, ['ShipmentRoutePoint'], {bypassCache: true}).then(function () {

                  vm.shipmentRoutePoints = sr.points;

                  $q.all(_.map(vm.shipmentRoutePoints, function (i) {
                    return ShipmentRoutePoint.loadRelations(i, ['Location'])
                      .then(function (rp) {
                        return rp;
                      });
                  })).then(resolve, reject);
                }, reject);


              }, reject);
            })
            .catch(function (res) {
              vm.serverError = res;
            });
        });

        vm.busy.then(function (routePoints) {

          vm.data = _.sortBy(_.filter(routePoints, 'reachedAtLocation'), 'reachedAt.timestamp');
          stopLoading();
          initMap();

        }, stopLoading)
        ;

      }

      vm.shipmentRoute = {
        "id": "3c04c9e9-1041-11e6-8130-005056850f57",
        "ts": "2016-05-03 15:06:35.471",
        "author": null,
        "date": "2016-05-03",
        "processing": "finished",
        "commentText": null,
        "driver": "686bfeb5-dc93-11e2-9d39-3c4a92df27e6",
        "agg": {
          "volumeIncidentCnt": 2,
          "volumeSum": 2468,
          "shipmentPositionCnt": 199,
          "shipmentCnt": 21,
          "shipmentRoutePointCnt": 14
        },
        "routePointsAgg": {"reachedCnt": 6}
      };

      angular.extend(vm, {

        refresh: function () {
          getData(vm.shipmentRoute);
        },

        fields: [
          {
            key: 'drivenBy.name',
            type: 'horizontalInput',
            templateOptions: {
              labelClass: 'col-xs-4',
              inputClass: 'col-xs-8',
              label: 'Водитель',
              disabled: true
            }
          }
        ],

        print: function () {
          $window.print();
        }

      });

      vm.refresh();

    });
})();

