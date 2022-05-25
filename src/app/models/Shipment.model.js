(function () {

  angular
    .module('streports')
    .run(function (Schema) {
      Schema.register({
        name: 'Shipment',
        relations: {
          hasOne: {
            Outlet: {
              localField: 'outlet',
              localKey: 'outletId'
            }
          }
        }
      });
    })
  ;
})();
