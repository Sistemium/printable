require('sistemium-gulp')
  .config({
    ngModule: 'streports',
    browserSync: {
      ghostMode: false,
      port: 3010,
      ui: {
        port: 3011
      }
    }
  })
  .run(require('gulp'));
