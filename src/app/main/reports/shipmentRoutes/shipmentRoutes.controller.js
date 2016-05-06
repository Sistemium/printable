'use strict';

export class ShipmentRoutesController {
  constructor ($http,$state,$log) {
    'ngInject'

    this.data = [];
    this.state = {
      at: $state.params.accessToken
    };
    this.init($http, $state, $log);
  }

  init($http, $state, $log) {
    $http({
      method: 'GET',
      url: 'https://r50.sistemium.com/api2/jsd/dr50/ShipmentRoute',
      headers: {
        authorization: $state.params.accessToken
      }
    }).then((response) => {
      this.data = response.data;
    }, (response) => {
      $log.error(response);
    });
  }
}
