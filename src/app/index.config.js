(function () {
  'use strict';

  angular
    .module('streports')
    .config(function ($logProvider, DSProvider, DSHttpAdapterProvider, $httpProvider) {
      // Enable log
      $logProvider.debugEnabled(true);

      angular.extend(DSProvider.defaults, {
        beforeInject: function (resource, instance) {
          if (!instance.id) {
            instance.id = uuid.v4();
          }
        },
        beforeCreate: function (resource, instance, cb) {
          if (!instance.id) {
            instance.id = uuid.v4();
          }
          cb(null, instance);
        }
      });

      angular.extend(DSHttpAdapterProvider.defaults, {

        basePath: 'JSDATA',

        httpConfig: {
          headers: {
            'X-Return-Post': 'true',
            'X-Page-Size': 1000
          }
        },

        queryTransform: function queryTransform(resourceConfig, params) {

          var res = {};

          if (params.offset) {
            res['x-start-page:'] = Math.ceil(params.offset / params.limit);
          }
          if (params.limit) {
            res['x-page-size:'] = params.limit;
          }

          delete params.limit;
          delete params.offset;

          return angular.extend(res, params);

        }

      });

      $httpProvider.interceptors.push('authInterceptor');
    })
  ;
})();
