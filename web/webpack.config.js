const CopyPlugin = require('copy-webpack-plugin');
const HandlebarsPlugin = require('handlebars-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const mergeJSON = require('handlebars-webpack-plugin/utils/mergeJSON');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');

const paths = {
  src: {
    root: '.',
    data: './src/data',
    doc: './src/doc',
    favicon: './src/favicon',
    fonts: './src/fonts',
    img: './src/img',
    js: './src/js',
    scss: './src/scss',
  },
  dist: {
    root: '.',
    css: './assets/css',
    doc: './assets/doc',
    favicon: './assets/favicon',
    fonts: './assets/fonts',
    img: './assets/img',
    js: './assets/js',
  },
};

// Resume config data
const resumeData = mergeJSON(path.join(__dirname, paths.src.data + '/**/*.json'));

module.exports = {
  devtool: 'source-map',
  entry: {
    libs: [paths.src.scss + '/libs.scss'],
    theme: [paths.src.js + '/theme.js', paths.src.scss + '/theme.scss'],
    'theme-sans-serif': [paths.src.scss + '/theme-sans-serif.scss'],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, paths.src.scss.slice(2)),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/](node_modules)[\\/].+\.js$/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  output: {
    filename: paths.dist.js + '/[name].bundle.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: paths.src.doc,
          to: paths.dist.doc,
        },
        {
          from: paths.src.favicon,
          to: paths.dist.favicon,
        },
        {
          from: paths.src.fonts,
          to: paths.dist.fonts,
        },
        {
          from: paths.src.img,
          to: paths.dist.img,
        },
        {
          from: paths.src.root + '/site.webmanifest',
          to: paths.dist.root + '/site.webmanifest'
        },
        {
          from: paths.src.root + '/browserconfig.xml',
          to: paths.dist.root + '/browserconfig.xml'
        },
      ],
    }),
    new HandlebarsPlugin({
      entry: path.join(process.cwd(), 'src', 'html', '**', '*.html'),
      output: path.join(process.cwd(), 'dist', '[path]', '[name].html'),
      partials: [path.join(process.cwd(), 'src', 'partials', '**', '*.{html,svg}')],
      data: resumeData,
      helpers: {
        ifEquals: function (arg1, arg2, options) {
          return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        is: function (v1, v2, options) {
          const variants = v2.split(' || ');
          const isTrue = variants.some((variant) => v1 === variant);

          return isTrue ? options.fn(this) : options.inverse(this);
        },
        isnt: function (v1, v2, options) {
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        },
        webRoot: function () {
          return '{{webRoot}}';
        }
      },
      onBeforeSave: function (Handlebars, resultHtml, filename) {
        const level = filename.split('//').pop().split('/').length;
        const finalHtml = resultHtml.split('{{webRoot}}').join('.'.repeat(level));

        return finalHtml;
      },
    }),
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: paths.dist.css + '/[name].bundle.css',
    }),
  ],
  devServer: {
    watchFiles: ['src/html/**/*', 'src/partials/**/*'],
  },
  target: 'web',
};
