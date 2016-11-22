'use strict';

(function () {

  function ImageHelper($q, $timeout) {

    return {loadImage};

    function loadImage(src) {

      return $q((resolve, reject) => {

        let image = new Image();

        image.onload = function () {
          if (this.complete === false || this.naturalWidth === 0) {
            return reject();
          }
          resolve(image);
        };

        image.onerror = function () {
          reject();
        };

        $timeout(() => {
          image.src = src;
        });

      });

    }

  }

  angular.module('streports')
    .service('ImageHelper', ImageHelper);

})();
