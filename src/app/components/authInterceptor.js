'use strict';

angular.module('streports')
  .factory('authInterceptor', function authInterceptor($stateParams, $q) {
    return {
      request: function (config) {

        let token = $stateParams.accessToken;
        let pool = $stateParams.pool;

        config.headers = config.headers || {};

        if (token) {
          config.headers.authorization = token;
        }

        if (!pool) {
          config.timeout = $q.reject('no pool');
        } else  if (/^JSDATA/.test(config.url)) {
          config.url = config.url.replace(/^JSDATA/, `https://api.sistemium.com/v4d/${pool}`);
        }

        return config;

      }
    }
  });
