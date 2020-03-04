const WebpackDevServer = require("webpack-dev-server"),
  webpack = require("webpack"),
  config = require("../webpack.config"),
  env = require("./env"),
  path = require("path");

for (let entryName in config.entry) {
  config.entry[entryName] =
    [
      ("webpack-dev-server/client?http://localhost:" + env.PORT),
      "webpack/hot/dev-server"
    ].concat(config.entry[entryName]);
}

config.plugins =
  [new webpack.HotModuleReplacementPlugin()].concat(config.plugins || []);

const compiler = webpack(config);

const server =
  new WebpackDevServer(compiler, {
    hot: true,
    contentBase: path.join(__dirname, "../build"),
    sockPort: env.PORT,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    disableHostCheck: true
  });

server.listen(env.PORT);
