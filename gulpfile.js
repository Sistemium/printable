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
          'http://localhost:9090/api': 'https://api.sistemium.com/v4d'
          //net:8878
        }
      }
    }
  })
  .run(require('gulp'));
