const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: './app',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'views')
	},
	module: {
	  rules: [
	    {
	      test: /\.js$/,
	      exclude: [/node_modules/],
	      use: [{
	        loader: 'babel-loader',
	        options: { presets: ['es2015', 'react'] }
	      }],
	    }
	  ]
	},
	devServer: {
		port: 3000,
		contentBase : './views',
		inline : true
	}
}
