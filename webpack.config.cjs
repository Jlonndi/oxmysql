const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');

const server = () => ({
  entry: './source/server/index.ts',
  output: {
    path: path.resolve(buildPath),
    filename: 'server/index.js',
  },
  devtool: 'source-map',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'ts',
          tsconfigRaw: require('./source/server/tsconfig.json'),
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new CleanWebpackPlugin(), new NodePolyfillPlugin()],
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'node16.9.1',
        minify: true,
        sourcemap: true,
        charset: 'utf8',
      }),
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
});

module.exports = [server];
