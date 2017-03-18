var express = require("express") ;
var path = require("path") ;
var bodyparser = require("body-parser") ;
var mysql  = require("mysql") ; 
var connection = require("express-myconnection") ;
var jsonfile  = require('jsonfile')

//var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require("./routes/index") ;
var accounts = require("./routes/accounts") ; 

var app = express() ;
var port = process.env.PORT || 3000 ; 

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs" );
app.engine("html", require("ejs").renderFile);

app.use(connection(mysql,{
     host: "localhost" ,
     user: "root" , 
     password: "" , 
     database :"accounts"
   } , 'request'
)) ;

app.use(express.static(path.join(__dirname,"clients"))) ; 

app.use(bodyparser.json()) ;
app.use(bodyparser.urlencoded({extended:false})) ;


app.use("/", index ) ;
app.use("/api", accounts) ; 

app.listen(port, function(){
    console.log("server started at port " + port);
});
