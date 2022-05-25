(function () {

  angular
    .module('streports')
    .run(function (Schema) {
      Schema.register({
        name: 'Partner',
        labels: {}
      });
    })
  ;
})();
