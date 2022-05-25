(function () {

  angular
    .module('streports')
    .run(function (Schema) {
      Schema.register({
        name: 'Outlet',
        relations: {
          hasOne: {
            Partner: {
              localField: 'partner',
              localKey: 'partnerId'
            }
          }
        }
      });
    })
  ;
})();
