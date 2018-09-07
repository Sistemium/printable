(function () {

  angular.module('streports')
    .component('visitReportMap', {

      bindings: {},
      templateUrl: 'app/reports/visitReportMap/visitReportMap.html',
      controllerAs: 'vm',
      controller: visitReportMapController

    });

  function visitReportMapController(mapsHelper, $timeout, $log, $state, VisitMapService, $q, $scope) {

    const vm = this;
    const readyDelay = 1000;
    const saveData = angular.isDefined($state.params.saveData);

    _.assign(vm, {

      mapOptions: {
        avoidFractionalZoom: false,
        margin: 0,
        balloonAutoPanMargin: 0,
        maxZoom: 16,
        minZoom: 0
      },

      markersInit: () => setReady('markersReady')
      // trackInit: () => setReady('trackReady'),
      // startMarkerInit: () => setReady('startMarkerReady')

    });

    /*
     Init
     */

    getData($state.params.date, $state.params.salesmanId);

    /*
     Functions
     */

    function setReady(code) {

      $log.info('setReady:', code);

      return $timeout(() => vm[code] = true, readyDelay);

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

      let rawLocations = _.map(vm.data, 'start');
      let bounds = mapsHelper.bounds(rawLocations);

      vm.map = {
        yaCenter: yaLatLng(bounds.center),
        afterMapInit
      };

      function afterMapInit(mapObj) {

        $log.info('bounds:', bounds);

        mapObj.setBounds(
          [yaLatLng(bounds.southwest), yaLatLng(bounds.northeast)],
          {
            checkZoomRange: true,
            preciseZoom: true,
            zoomMargin: [40, 30, 20, 40]
          }
        ).then(onMapReady);

        function onMapReady() {

          let clusters = [];
          let pixelCoordsFn = mapsHelper.yPixelCoords(mapObj);

          let lastCoords;

          _.each(vm.data, (rp, idx) => {

            let pixelCoords = pixelCoordsFn(rp.start);

            if (!lastCoords || mapsHelper.yPixelDistance(lastCoords, pixelCoords) > 55) {

              clusters.push({
                location: rp.start,
                labels: [idx + 1],
                hints: []
              });

              lastCoords = pixelCoords;

            } else {

              let cluster = _.last(clusters);
              cluster.labels.push(idx + 1);
              // cluster.hints.push(rp.name);

            }

          });

          $timeout(500)
            .then(loadData);

          function loadData() {

            vm.markers = _.map(clusters, (cluster, idx) => {

              return mapsHelper.yMarkerConfig({
                id: idx + 1,
                location: cluster.location,
                content: cluster.labels.join(', '),
                hintContent: cluster.labels.join(', ')
              });

            });

            if (rawLocations.length) {

              let coordinates = _.map(rawLocations, yaLatLng);

              mapsHelper.yRoute(coordinates)
                .then(route => {

                  let paths = route.getPaths();

                  paths.options.set({
                    strokeWidth: 3,
                    strokeColor: '0000ffff',
                    opacity: 0.9
                  });

                  mapObj.geoObjects.add(paths);
                  mapObj.setBounds(paths.getBounds(), {
                    checkZoomRange: true,
                    preciseZoom: true,
                    zoomMargin: [40, 30, 20, 40]
                  });

                  vm.lengths = _.map(paths.toArray(), path => {
                    return path.getLength() || 0;
                  });

                  $scope.$applyAsync();

                });


            }


          }

        }

      }

    }

    function getData(date, salesmanId) {

      vm.isLoading = true;

      vm.busy = VisitMapService.getRoutes(date, salesmanId);

      vm.busy.then(onData)
        .then(() => {
          stopLoading();
          initMap();
        })
        .catch(stopLoading);

      $scope.$watch(() => !!vm.lengths, (gotLengths) => {
        if (gotLengths) {
          saveFinalData(vm.lengths);
        }
      });

      function stopLoading(error) {
        vm.isLoading = false;
        if (error) {
          vm.errorReady = error;
        }
      }

      function onData(routePoints) {

        vm.data = _.sortBy(routePoints, 'start.timestamp');
        vm.date = date;

        if (!vm.data.length) {
          return $q.reject('no data with reachedAtLocation');
        }

      }

      function saveFinalData(lengths) {

        let reportData = _.map(vm.data, (visit, idx) => {

          let length = idx ? lengths[idx - 1] : 0;

          return _.assign({length}, visit);

        });

        $log.info('reportData', lengths);

        if (!saveData) {
          return;
        }

        VisitMapService.saveReportData(date, salesmanId, reportData)
          .then(() => setReady('trackReady'))
          .catch(error => {
            $log.error(error);
            vm.errorReady = true;
          });

      }

    }


  }

})();
