// Some plugin stuff: 
const HtmlWebPackPlugin = require("html-webpack-plugin");

// Via the webpack-plugin module we instantiate the template, and an index.html file upon which the templare is assembled. 
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

module.exports = {
	module:{
		rules:[
			{
				test: /\.js$/, 
				exclude: /node_modules/,
				use:{
					loader: "babel-loader"
				}
			}, 
      {
        test: /\.mp3$/,
        loader: 'file-loader'
      },
			{
         test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
         use: [{
           loader: 'file-loader',
           options: {
           		includePaths:['./icons']
           }
         }]
      },
			{
				test: /\.css$/, 
				use: [ 
					{
						loader: "style-loader"
					},
					{
						loader:"css-loader", 
						options:{
							modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64]",
              sourceMap: true,
              minimize: true
						}
					}
				]
			}
		]
	}, 
	plugins: [htmlPlugin], 
	output: {
		path: __dirname + "/docs",
		filename: "main.js"
	}
};