'use strict';

angular.module('streports')
  .factory('authInterceptor', function authInterceptor($stateParams) {
    return {
      request: function (config) {
        var token = $stateParams.accessToken;
        config.headers = config.headers || {};

        if (token) {
          config.headers.authorization = token;
        }

        if (/^JSDATA/.test(config.url)) {
          //TODO change dr50 to dev
          config.url = config.url.replace(/^JSDATA/, 'https://api.sistemium.com/api2/jsd/dr50/');
        }

        return config;
      }
    }
  })
;
