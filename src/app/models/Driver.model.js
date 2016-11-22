'use strict';

(function () {

  angular.module('jsd').run(function (Schema) {

    Schema.register({

      name: 'Driver',

      labels: {
        multiple: 'Водители',
        single: 'Водитель'
      }

    });

  });

})();
