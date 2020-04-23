import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
// import { fileURLToPath } from 'url'

// const dirname: string = path.dirname(fileURLToPath(import.meta.url))
const dirname: string = __dirname

export default {
  entry: './site/main.js',
  output: {
    path: path.join(dirname, 'docs'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.marko'],
    alias: {
      icons: path.join(__dirname, 'dist'),
    },
  },
  module: {
    rules: [
      {
        test: /\.marko$/,
        loader: '@marko/webpack/loader',
      },
      {
        test: /\.(t|j)s$/,
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({})],
}
