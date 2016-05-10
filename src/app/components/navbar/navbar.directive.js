(function () {
  'use strict';

  angular
    .module('streports')
    .directive('navbarDirective', function NavbarDirective() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/navbar/navbar.html'
      };
    })
  ;
})();

