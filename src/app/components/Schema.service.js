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
        },

        patch: function (id, params) {

          let resource = this;
          let url = resource.getAdapter('http').defaults.basePath + '/' + resource.endpoint;

          url += '/' + (_.get(id, 'id') || id);

          return $http.patch(url, params)
            .then(function (res) {
              return res;
            });

        }

      });

    })
  ;
})();
