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
              localKey: 'shipmentRouteId'
            },
            Location: {
              localField: 'reachedAt',
              localKey: 'reachedAtLocationId'
            },
            ShippingLocation: {
              localField: 'shippingAtLocation',
              localKey: 'shippingLocationId'
            }
          }
        },

        computed: {},

        aggregables: []

      });

    })
  ;
})();
