(function (module) {

  module.component('currencyValue', {

    bindings: {
      hideEmpty: '<',
      value: '<',
      label: '@',
      currency: '@',
      decimals: '<'
    },

    controller: currencyValueController,
    controllerAs: 'vm',

    templateUrl: 'app/components/currencyValue/currencyValue.html'

  });

  function currencyValueController() {

    let vm = this;

    if (!vm.weight) {
      vm.weight = 600
    }

    if (!_.isNumber(vm.decimals)) {
      vm.decimals = 2
    }

    vm.currency = vm.currency || '₽';

  }

})(angular.module('streports'));
