(function () {

  angular.module('streports')
    .run(function (Schema) {

      Schema.register({
        name: 'VisitReport'
      });

      Schema.register({
        name: 'VisitMapReport'
      });

    });

})();
