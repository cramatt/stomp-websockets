const conf = require('./gulp.conf');

module.exports = function () {
  return {
    server: {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src
      ]
    },
    ghostMode: false,
    open: false,
    codeSync: true,
    // socket: {
    //   namespace: '/browsersync',
    //   domain: 'localhost:4444'
    // }
  };
};
