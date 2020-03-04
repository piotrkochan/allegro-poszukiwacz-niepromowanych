const webpack = require("webpack"),
  path = require("path"),
  fs = require("fs"),
  env = require("./utils/env"),
  CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  WriteFilePlugin = require("write-file-webpack-plugin");

const alias = {};
const secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));
const extraManifestPath = path.join(__dirname, "manifest", env.TARGET + ".json");
const fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];
let manifest = {};

if (fs.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}
if (fs.existsSync(extraManifestPath)) {
  manifest = JSON.parse(fs.readFileSync(extraManifestPath).toString());
}

const options = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    popup: path.join(__dirname, "src", "popup", "popup.js"),
    iconChanger: path.join(__dirname, "src", "background", "iconChanger.js"),
    background: path.join(__dirname, "src", "background", "background.js"),
    content: path.join(__dirname, "src", "content", "contentScript.js"),
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(jsx|tsx|js|ts)$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions.map(extension => ("." + extension)).concat([".jsx", ".ts", ".js"])
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new CopyWebpackPlugin([
      {
        from: 'assets/*',
      },
      {
        from: "src/manifest.json",
        transform: function (content, path) {
          // generates the manifest file using the package.json data
          return Buffer.from(JSON.stringify({
            description: process.env.npm_package_description,
            version: process.env.npm_package_version,
            ...manifest,
            ...JSON.parse(content.toString())
          }))
        }
      }]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"]
    }),
    new WriteFilePlugin()
  ]
};

if (env.NODE_ENV === "development") {
  options.devtool = "inline-cheap-source-map";
}

module.exports = options;
