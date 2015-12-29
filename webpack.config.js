module.exports = {
  entry: [
    './src/main'
  ],
  output: {
    path: '.',
    filename: 'bundle.js'
  },

  resolve: {
    // Allow to omit extensions when requiring these files
    extensions: ['', '.js']
  },
  watchDelay: 0,
  watch: true,
  externals: {},
  devtool: '#inline-source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
