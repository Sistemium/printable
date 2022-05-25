(function () {

  angular
    .module('streports')
    .run(function (Schema) {
      Schema.register({
        name: 'ShipmentPosition',
        labels: {},
        relations: {
          hasOne: {
            // Shipment: {
            //   localField: 'shipment',
            //   localKey: 'shipmentId'
            // },
            Article: {
              localField: 'article',
              localKey: 'articleId'
            }
          }
        }
      });
    })
  ;
})();
