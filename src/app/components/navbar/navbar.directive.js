(function () {
  'use strict';

  angular
    .module('streports')
    .directive('navbar', function NavbarDirective() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/navbar/navbar.html'
      };
    })
  ;
})();

