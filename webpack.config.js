const path = require('path');

module.exports = {
  entry: "./src/main.tsx",
  output: {
      filename: "main.js",
      path: path.join(__dirname, "dist")
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [ ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [ "awesome-typescript-loader" ]
      }
      // ,
      // {
      //   test: /\.js$/,
      //   use: [ "source-map-loader" ]
      // }
    ]    
  }
};
