(function () {
  'use strict';

  angular.module('streports')
    .service('Schema', function SchemaService(saSchema, $http) {
      return saSchema({

        getCount: function (resource, params) {
          return $http.get(
            resource.getAdapter('http').defaults.basePath + resource.endpoint,
            {
              params: angular.extend({'agg:': 'count'}, params || {})
            }
          ).then(function (res) {
            return parseInt(res.headers('x-aggregate-count'));
          });
        },

        getList: function (params) {
          return this.findAll(params, {bypassCache: true});
        }

      });

    })
  ;
})();