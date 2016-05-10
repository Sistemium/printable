(function () {
  'use strict';

  angular
    .module('streports')
    .run(function LocationModel(Schema) {
      Schema.register({
        name: 'Location',
        labels: {
          multiple: 'Геометки',
          single: 'Геометка'
        }
      });
    })
  ;
})();
