
(function () {
  'use strict';

  angular
    .module('streports')
    .run(function ShipmentRouteModel(Schema) {
      Schema.register({

        name: 'ShipmentRoute',

        labels: {
          multiple: 'Маршруты доставки'
        },

        relations: {
          hasOne: {
            Driver: {
              localField: 'drivenBy',
              localKey: 'driver'
            }
          },
          hasMany: {
            ShipmentRoutePoint: {
              localField: 'points',
              foreignKey: 'shipmentRoute'
            },
            ShippingArticleIncident: {
              localField: 'incidents',
              foreignKey: 'shipmentRoute'
            }
          }
        },

        computed: {},

        aggregables: []

      });
    })
  ;
})();
