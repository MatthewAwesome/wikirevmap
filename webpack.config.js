// Some plugin stuff: 
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'
// Via the webpack-plugin module we instantiate the template, and an index.html file upon which the templare is assembled. 
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});


module.exports = {
	module:{
		rules:[
		// Triggers ify-loader for all javascript files in plotly.js modules directory. 
		// this is for bundling plotly. 
			{
				test: /\.js$/, 
				use:{
					loader: "ify-loader", 
					options: {
					includePaths:['./node_modules/plotly.js']
					}
				}
			}, 		
			// Triggers babel-loader for all javascript files not in node_modules. 
			// Bundles all .js files in src. 
			{
				test: /\.js$/, 
				exclude: /node_modules/,
				use:{
					loader: "babel-loader"
				}
			}, 
			// Bundles mp3 files via 'file-loader'. 
      {
        test: /\.mp3$/,
        loader: 'file-loader'
      },
      // for loading things from a directory titled 'icons'
			{
         test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
         use: [{
           loader: 'file-loader',
         }]
      },
      // This is for loading styles: 
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      }
		]
	}, 
	plugins: [
		htmlPlugin, 
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
	], 
	output: {
		path: __dirname + "/docs",
		filename: "main.js"
	}
};