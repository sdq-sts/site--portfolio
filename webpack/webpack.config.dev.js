const config = require('./config.json')
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractSass = new ExtractTextPlugin({ filename: path.join('css', config.cssFilename) })
const HtmlWebpackPlugin = require('html-webpack-plugin')
const hotModule = new webpack.HotModuleReplacementPlugin()

module.exports = {
  devtool: 'eval-source-map',
  entry: config.entry,
  output: {
    path: path.join(__dirname, '..', config.distPath),
    filename: path.join('js', config.jsFilename)
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    stats: { cached: false },
    compress: true,
    hot: true,
    inline: true,
    port: 9000
  },

  module: {
    rules: [

      { // HTML
        test: /.html$/i,
        loader: 'html-loader',
        options: {
          interpolate: true,
          minimize: false,
          attrs: [':src']
        }
      },

      { // JS
        test: /.js$/i,
        use: [{ loader: 'babel-loader', query: { presets: ['env'] } }],
        exclude: /node_modules/
      },

      { // SCSS
        test: /.scss$/i,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'resolve-url-loader' },
          { loader: 'postcss-loader', options: { plugins: () => [require('autoprefixer')] } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ],
        exclude: /node_modules/
      },

      { // CSS
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } }
        ],
        exclude: /style.css/
      },

      { // Audio
        test: /\.(wav|mp3)$/i,
        use: [
          { loader: 'file-loader', options: { useRelativePath: false, publicPath: 'audio/', outputPath: 'audio/' } }
        ]
      },

      { // Fonts
        test: /\.(eot|ttf|woff|woff2)$/i,
        loader: 'file-loader',
        query: { useRelativePath: false, publicPath: 'fonts/', outputPath: 'fonts/' }
      },

      { // Images (Optimized)
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          { loader: 'file-loader', query: { useRelativePath: false, publicPath: 'images/', outputPath: 'images/' } },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { quality: 75 },
              pngquant: { quality: '65-90', speed: 4 },
              svgo: { plugins: [ { removeViewBox: false }, { removeEmptyAttrs: false } ] },
              gifsicle: { optimizationLevel: 7, interlaced: false },
              optipng: { optimizationLevel: 7, interlaced: false }
            }
          }
        ]
      },

      { // Videos
        test: /\.(webm|mp4)$/i,
        loader: 'file-loader',
        query: { useRelativePath: false, publicPath: 'assets/', outputPath: 'assets/', name: '/[name].[ext]' }
      }

    ]
  },

  plugins: [
    extractSass,
    hotModule,
    new HtmlWebpackPlugin({ filename: 'index.html', template: 'src/index.html' }),
    new HtmlWebpackPlugin({ filename: 'sobre.html', template: 'src/pages/sobre.html' }),
    new HtmlWebpackPlugin({ filename: 'contato.html', template: 'src/pages/contato.html' })
  ]
}
