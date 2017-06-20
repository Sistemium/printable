
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
              localKey: 'driverId'
            }
          },
          hasMany: {
            ShipmentRoutePoint: {
              localField: 'points',
              foreignKey: 'shipmentRouteId'
            },
            ShippingArticleIncident: {
              localField: 'incidents',
              foreignKey: 'shipmentRouteId'
            }
          }
        },

        computed: {},

        aggregables: []

      });
    })
  ;
})();
