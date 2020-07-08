var path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

var config = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: '[name].build.js',
  },
  resolve: {
    alias: {
      '@': resolve('src'),
    }
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 9000,
    hot: true,
    open: true,
  },
  module: {
    rules: [
      {
          test: /\.vue$/,
          loader: 'vue-loader'
      },
      {
          test: /\.css$/,
          use: [
              'vue-style-loader',
              'css-loader',
          ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/assets/images/[name].[hash:7].[ext]',
          esModule: false,
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/assets/media/[name].[hash:7].[ext]',
          esModule: false,
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/assets/fonts/[name].[hash:7].[ext]',
          esModule: false,
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      favicon: 'public/favicon.png',
    }),
    new VueLoaderPlugin(),
  ],
};
module.exports = config;
