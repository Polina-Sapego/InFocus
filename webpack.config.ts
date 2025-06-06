import * as path from 'path';
import { Configuration } from 'webpack';
import 'webpack-dev-server';
import MiniCssExtractPlugin = require('mini-css-extract-plugin');
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import HtmlWebpackPlugin = require('html-webpack-plugin');
import CopyPlugin = require('copy-webpack-plugin');

const isAnalyzer = process.env.ANALYZER === 'true';

const config: Configuration = {
  entry: path.join(__dirname, '/src', 'index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'assets/images/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/public', 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'assets/images', to: 'images' },
      ],
    }),
    ...(isAnalyzer ? [new BundleAnalyzerPlugin()] : []),
  ],
  resolve: {
    alias: {
      '@images': path.resolve(__dirname, './assets/images/'),
      '@styles': path.resolve(__dirname, './assets/styles/'),
      '@redux': path.resolve(__dirname, './src/redux/'),
      '@components': path.resolve(__dirname, './src/components/'),
    },
    extensions: ['.tsx', '.ts', '.js', '.png'],
  },
  devServer: {
    historyApiFallback: true,
  },
}

export default config;
