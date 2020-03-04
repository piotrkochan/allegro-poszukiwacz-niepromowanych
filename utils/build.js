const webpack = require("webpack"),
  env = require("./env"),
  path = require("path"),
  FileManagerPlugin = require('filemanager-webpack-plugin'),
  config = require("../webpack.config");

if (env.ARCHIVE_DIST) {
  const distName = env.TARGET + "_" + process.env.npm_package_version + '.zip';
  config.plugins.push(
    new FileManagerPlugin({
      onEnd: {
        mkdir: [path.join(__dirname, "..", "dist")],
        archive: [
          {source: config.output.path, destination: path.join(__dirname, "..", "dist", distName)},
        ]
      }
    })
  );
}

webpack(
  config,
  function (err) {
    if (err) throw err;
  }
);
