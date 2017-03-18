var webpack = require('webpack') ;
var htmlwebpack = require('html-webpack-plugin') ;

module.exports = {
   entry: './server.js' , 
   output: {
       path: './dist'  , 
       filename: 'app.server.js'
   } , 
   module:{
       loaders: [
           {test: /\.ts$/, loader:'ts-loader'}
       ]
   },
   resolve:{
       extensions:[ '.js', '.ts']
   } ,
   plugins:[
       new htmlwebpack({
           template: './index.html'
       })
   ]  

} ;