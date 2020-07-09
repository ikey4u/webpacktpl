# 手动创建 webpack 项目

新建项目目录, 并在项目根目录下生成 package.json 文件

    mkdir proj && npm init -y

- webpakc 安装与配置

    安装 webpack

        npm i webpack webpack-cli -D

    webpack 的配置文件为 webpack.config.js, 设置其内容如下

        var path = require('path');

        var config = {
            entry: './src/main.js',
            output: {
                path: path.resolve(__dirname + '/dist'),
                filename: '[name].build.js',
            },
        };
        module.exports = config;

    在这里配置了 webpack 的入口文件为 src/main.js, 其内容如下

        console.log('hello world');

    在 package.json 中加入 build 命令, 如下

        "scripts": {
          "build": "webpack --mode=production",
        },

    然后执行 npm run build 即可生成 dist 目录, 其下会生成一个编译好的 js 文件.

- 处理 html 文件

    安装插件

        npm i html-webpack-plugin -D

    在 webpack.config.js 的中配置该插件,

        var config = {
          plugins: [
            new HtmlWebpackPlugin({
              filename: 'index.html',
              template: 'public/index.html',
              favicon: 'public/favicon.png',
            }),
          ],
        }

    设置入口 html 文件为 public/index.html, 其内容如下:

        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width,initial-scale=1.0">
            <title>webpack project</title>
          </head>
          <body>
            <div id="app"></div>
          </body>
        </html>

    同时配置 favicon 文件, 只需要在 public 下放入 favicon.png 文件即可,
    favicon 可以通过这里 https://github.com/faviator/faviator 来简单生成.

- 开启 webpack 的开发模式

    在开发时进行自动构建和刷新, 安装插件

        npm i webpack-dev-server -D

    在 webpack.config.js 中添加如下配置

        var config = {
          devServer: {
            contentBase: path.join(__dirname, "public"),
            compress: true,
            port: 9000,
            hot: true,
            open: true,
          },
        }

    在 package.json 中可以添加新的脚本命令

        "scripts": {
            "serve": "webpack-dev-server"
        }

- 引入 vue

    为了让  webpack 解析 vue 需要以下插件支持

        npm i vue vue-loader vue-template-compiler -D

    在 webpack.config.js 中配置

        const VueLoaderPlugin = require('vue-loader/lib/plugin');
        var config = {
          plugins: [
            new VueLoaderPlugin(),
          ],
          module: {
            rules: [
              {
                  test: /\.vue$/,
                  loader: 'vue-loader'
              },
            ]
          },
        }

    安装 css 加载器

        npm i vue-style-loader css-loader -D

    在 webpack.config.js 中配置

        var config = {
          module: {
            rules: [
              {
                  test: /\.css$/,
                  use: [
                      'vue-style-loader',
                      'css-loader',
                  ],
              },
            ]
          },
        }

    新建 src/App.vue, 内容如下

        <template>
          <div>
            <div>
              {{ msg }}
            </div>
          </div>
        </template>

        <script>
        export default {
          data () {
            return {
              msg: "hello webpack",
            }
          },
        }
        </script>

        <style>
        </style>

    修改 src/main.js, 内容如下

        import Vue from 'vue';
        import App from './App.vue';

        new Vue({
          el: '#app',
          render: h => h(App),
        });

    运行 npm run serve 即可打开浏览器看效果.

- 引入 Babel 支持

    引入 babel 是为了让我们能够以 ES6 的语法来写 JS.

        npm i babel-loader @babel/core @babel/preset-env -D

    配置 webpack.config.js

        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              }
            }
          ]
        }

    在 App.vue 加入 methods 测试 ES6 语法, 这里引入的方法是 square,
    使用了 let 语法, 箭头语法, 如下所示

        export default {
          data () {
            return {
              msg: this.square(2, 4, 6, 8),
            }
          },
          methods: {
            square() {
              let example = () => {
                let numbers = [];
                for (let number of arguments) {
                  numbers.push(number * number);
                }

                return numbers;
              };
              return example();
            }
          }
        }

- 文件支持(图片, 字体, 多媒体支持)

    安装插件, 其中 url-loader 依赖于 file-loader

        npm i install url-loader file-loader -D

    配置 webpack.config.js

        var config = {
          module: {
            rules: [
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
        }

    注意要设置 esModule 为 false, 参见 @[https://github.com/vuejs/vue-loader/issues/1612],
    我们在 url-loader 中的 options 里用 name 来指定输出文件的路径, 稍后会提及.

    接下来我们测试在 vue 模板, js 以及 css 中引入图片, 字体和其他多媒体文件的引
    入是类似的.

    在 src/assets/images/ 下放入 logo.png 和 bg.jpg  文件,
    修改 App.vue 在模板中加入如下代码:

        <template>
          <div>
            <div>
              <img src="./assets/images/logo.png" alt="">
              <img :src="logourl" alt="">
            </div>
            <div>
              {{ msg }}
            </div>
          </div>
        </template>

    在 js 中加入如下代码

        data () {
          return {
            logourl: require('./assets/images/logo.png'),
          }
        }

    在 style 中加入如下样式

        html {
          height: 100%;
          background-image: url(./assets/images/bg.jpg);
          background-position: center;
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }

    然后在浏览器中即可看到效果, 在浏览器中我们能看到我们的图片路径是

        http://localhost:9000/static/assets/images/bg.28be499.jpg

    后面的 /static/assets/images/bg.28be499.jpg  即为配置 url-loader 时生成的.

- webpack 别名

    为了方便使用, 我们可以在 webpack 中配置别名

        const resolve = dir => path.resolve(__dirname, dir);
        var config = {
          resolve: {
            alias: {
              '@': resolve('src'),
            }
          },
        }

    比如我们这里配置了 @ 符号表示 src 目录, 那么我们在引入相关资源时就可以进行简写.

# 环境变量

在 webpack 4 中引入了 mode 这一配置, 我们可以在构建命令中指定开发环境和生产环境.

举个例子如下

    "scripts": {
      "build": "NODE_ENV=production webpack --mode production",
      "dev": "NODE_ENV=development webpack-dev-server --mode development"
    },

这个例子等价于

    "scripts": {
      "build": "NODE_ENV=production webpack",
      "dev": "NODE_ENV=development webpack-dev-server"
    },

其中 `NODE_ENV` 用于设定在 webpack.config.js(构建脚本) 中的 `process.env.NODE_ENV` 变量,
而后面的 `--mode` 则用来设定在应用程序中的 `process.env.NODE_ENV` 变量.

需要注意的是, `--mode` 的值只能为 production 或者 development, 默认情况下,
webpack 命令指定 mode 为 production 而 webpack-dev-server 则指定 mode 为
development.

如果我们需要在应用程序中定义更多环境变量, 那么可以使用 DefinePlugin,
比如我们要加入一个 TYPE 环境变量, 在 package.json 中设置如下

    "scripts": {
        "build": "NODE_ENV=production TYPE=html webpack --mode production",
        "dev": "NODE_ENV=development TYPE=html webpack-dev-server --mode development"
    },


那么可以在构建脚本中使用 process.env.TYPE 获取 TYPE 变量的值, 设置 DefinePlugin
如下

    var config = {
      plugins: [
        new webpack.DefinePlugin({
          TYPE: JSON.stringify(process.env.TYPE),
        }),
      ],
    };

在应用程序中直接使用 TYPE 变量即可, 如

    console.log('type: ', TYPE);

# 参考

- babel-loader: https://webpack.js.org/loaders/babel-loader/
- webpack4练手项目-搭建Vue项目: https://juejin.im/post/5d7a2564f265da03951a218b
- Learn ES2015: https://babeljs.io/docs/en/learn/#arrows-and-lexical-this
