(function () {
  'use strict';

  angular
    .module('streports')
    .run(function ShipmentRoutePointModel(Schema) {
      Schema.register({

        name: 'ShipmentRoutePoint',

        labels: {
          multiple: 'Точки маршрута доставки'
        },

        relations: {
          hasOne: {
            ShipmentRoute: {
              localField: 'parentRoute',
              localKey: 'shipmentRoute'
            },
            Location: {
              localField: 'reachedAt',
              localKey: 'reachedAtLocation'
            },
            ShippingLocation: {
              localField: 'shippingAtLocation',
              localKey: 'shippingLocation'
            }
          }
        },

        computed: {},

        aggregables: []

      });

    })
  ;
})();
