var express = require("express");
var app=express();
var usuario;
const mysql = require('mysql');

//Se crea la coneccion.
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'salvador',
  password: 'Chavapi181113<3',
  database: 'PasteleriaDB'
});

var bodyParser=require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});


//POST
app.post('/plogin',function(req,res)
{
    var user_n =req.body.id;
    var pass=req.body.pass;
    var Aut;
    connection.query("SELECT count(*) FROM clients WHERE name=" + mysql.escape(user_n) + "AND password=" +mysql.escape(pass),function(err,result,fields)
    {
       if(err) throw err;
       console.log("User Login") 
       Aut=result;
    });
});

var server = app.listen(8080,function(){
  console.log('Service Running...');
});