const path = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const manifest = require('./package.json');

const analyze = process.argv.includes('--analyze');

// https://webpack.js.org/configuration/entry-context/#context
const context = path.resolve(__dirname, 'src');

// https://webpack.js.org/configuration/entry-context/#entry
const entry = [
  'regenerator-runtime/runtime',
  './xcoobee/sdk/browser.js',
];

// https://webpack.js.org/configuration/externals/#externals
const externals = undefined;

// https://webpack.js.org/configuration/module/
const loaders = {
  // https://webpack.js.org/configuration/module/#module-noparse
  noParse: /jquery|lodash/,
  // https://webpack.js.org/configuration/module/#module-rules
  rules: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
    },
  ],
};

const node = {
  fs: 'empty',
  path: 'empty',
  readline: 'empty',
};

// https://webpack.js.org/configuration/output/
const output = {
  //
  // | Substitution | Description |
  // | :----------: | ----------- |
  // | [chunkhash]  | The hash of the chunk content. |
  // | [file]       | The module filename. |
  // | [filebase]   | The module basename. |
  // | [hash]       | The hash of the module identifier. |
  // | [id]         | The module identifier. |
  // | [name]       | The module name. |
  // | [query]      | The module query, i.e., the string following `?` in the filename. |
  //
  // When using the `ExtractTextWebpackPlugin`, use `[contenthash]` to obtain a
  // hash of the extracted file (neither `[hash]` nor `[chunkhash]` work).
  //
  // TODO: Use the package version number in the filename.
  //
  // https://webpack.js.org/configuration/output/#output-filename
  // filename: 'xcoobee-sdk-[chunkhash].web.js',
  filename: `xcoobee-sdk-${manifest.version}.web.js`,
  // Note: The following will become the name of a global variable.
  library: 'XcooBee',
  // Note that `[hash]` in this parameter will be replaced with an hash of the
  // compilation.
  // https://webpack.js.org/configuration/output/#output-path
  path: path.resolve(__dirname, 'dist'),
  pathinfo: false,
};

// https://webpack.js.org/configuration/plugins/
const plugins = [
  analyze && new BundleAnalyzerPlugin(),
].filter(Boolean);

// https://webpack.js.org/configuration/resolve/
const resolve = undefined;

// https://webpack.js.org/configuration/target/
const target = 'web';

const config = {
  context,
  entry,
  externals,
  module: loaders,
  node,
  output,
  plugins,
  resolve,
  target,
};

module.exports = config;
