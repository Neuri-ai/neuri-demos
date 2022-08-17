const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
  entry: {
    'permissions': path.resolve(__dirname, 'src/permissions.ts'),
    'drawer': path.resolve(__dirname, 'src/drawer.ts'),
    'push-to-talk': path.resolve(__dirname, 'src/push-to-talk.ts'),
    'browser-uikit.bundle.min': path.resolve(__dirname, 'src/main.ts'),

  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template:  path.join(__dirname, "public/index.html"),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
      directory: path.join(__dirname, "dist")
    },
    compress: true,
    port: 8080,
  },
};