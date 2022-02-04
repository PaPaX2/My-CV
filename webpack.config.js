const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Handlebars = require("handlebars");
const fs = require('fs');

const getAssets = function(item) {
  let asset = fs.readFileSync(`./src/assets/${item}.hbs`, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    return data;
  })
  return asset;
};


const hbs = [
  'index'
].map(
  item =>
    new HtmlWebpackPlugin({
      template: `./src/${item}.hbs`,
      filename: `${item}.html`,
      inject: 'head',
      options: {
        menu: 'test',
        interpolate: true
      }
    })
);
module.exports = {
  mode: 'development',
  entry: './src/app.js',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
  },
  output: {
    filename: './src/index.js',
    path: path.resolve(__dirname, './build'),
  },
  
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
          }
        }
      },
      {
        test: /\.hbs$/i,
        //exclude: '/src/assets/',
        use: {
          loader: "html-loader",
          options: {
            preprocessor: (content, loaderContext) => {
              let result;
  
              try {
                result = Handlebars.compile(content)({
                 header: getAssets('header'),
                 footer: getAssets('footer'),
                });
              } catch (error) {
                loaderContext.emitError(error);
  
                return content;
              }
  
              return result;
            },
          },
        },
      }
    ],
  },
  plugins: [
    
    new MiniCssExtractPlugin ({
      filename: 'src/style.css',
    }),

    new CleanWebpackPlugin(),

    ...hbs,
  ]
};