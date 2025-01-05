const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path');
const Dotenv = require('dotenv-webpack');

const deps = require("./package.json").dependencies;

const printCompilationMessage = require('./compilation.config.js');

module.exports = (_, argv) => ({
  output: {
/*    filename: 'main.js', // Генерация main.js*/
    publicPath: "http://localhost:10050/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 10050,
    historyApiFallback: true,
/*    static: {
      directory: path.join(__dirname, "dist"), // Папка с файлами сборки
    },*/
    watchFiles: [path.resolve(__dirname, 'src')],
    onListening: function (devServer) {
      const port = devServer.server.address().port

      printCompilationMessage('compiling', port)

      devServer.compiler.hooks.done.tap('OutputMessagePlugin', (stats) => {
        setImmediate(() => {
          if (stats.hasErrors()) {
            printCompilationMessage('failure', port)
          } else {
            printCompilationMessage('success', port)
          }
        })
      })
    }
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        'auth-microfrontend': 'auth_microfrontend@http://localhost:10051/remoteEntry.js',
/*        'profile-microfrontend': 'profile_microfrontend@http://localhost:10052/remoteEntry.js',*/
        'cards-microfrontend': 'cards_microfrontend@http://localhost:10053/remoteEntry.js',
      },
      exposes: {},
      shared: {
        ...deps,
        'react-router-dom': {
          singleton: true,
          eager: false,
          requiredVersion: deps["react-router-dom"]
        },
        'react': {
          singleton: true,
          eager: false,
          requiredVersion: deps["react"]
        },
        'react-dom': {
          singleton: true,
          eager: false,
          requiredVersion: deps["react-dom"]
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new CopyWebpackPlugin([
        { from: 'manifest.json', to: '.' },
      ],
    ),
    new Dotenv()
  ],
});
