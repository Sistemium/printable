require('sistemium-gulp')
  .config({
    ngModule: 'streports',
    browserSync: {
      ghostMode: false,
      port: 3010,
      ui: {
        port: 3011
      }
    },
    build: {
      replace: {
        js: {
          '\'//api-maps.yandex.ru': '\'https://api-maps.yandex.ru',
          'localhost:9090': 'api1.sistemium.net:8878'
        }
      }
    }
  })
  .run(require('gulp'));
