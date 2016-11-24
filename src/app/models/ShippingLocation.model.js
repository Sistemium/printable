'use strict';

(function () {

  angular.module('jsd').run(function (Schema) {

    Schema.register({

      name: 'ShippingLocation',

      labels: {
        multiple: 'Точки разгрузки',
        single: 'Точки разгрузки'
      }

    });

  });

})();
