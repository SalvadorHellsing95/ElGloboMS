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

app.get('/',function(req,res,next){
    if(req.query.filter){
        next();
        return;
    }
        //Se utiliza para usar json con texto plano.
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    res.send('Prueba.');
  });
//POST
app.post('/login',function(req,res)
{
        //Se utiliza para usar json con texto plano.
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');

    var user_n =req.body.correo;
    var contras=req.body.contra;
    var Aut;
    connection.query("SELECT count(*) FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
    {
       if(err) throw err;
       console.log("User Login Step 1");
        //Se utiliza para usar json con texto plano.
       Aut=result;
    });
    if(Aut!=0)
    {
       connection.query("SELECT * FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
    {
       if(err) throw err;
       console.log("User Login Step 2");
       res.send(result);
    }); 
    }
});

app.get('/cubiertas',function(req,res)
{
    //Se utiliza para usar json con texto plano.
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');

    connection.query("SELECT * FROM Cubierta",function(err,result,fields)
    {
       if(err) throw err;
       console.log("Cubierta Query");
       res.send(result);
    });
});
app.get('/Search/Cubierta',function(req,res){
    var CubID=req.query.cubierta_id;

    connection.query("SELECT * FROM Pastel WHERE cubiertaID="+mysql.escape(CubID),function(err,result,fields)
    {
        if(err) throw err;
        console.log("Search Cubierta");
        res.send(result);
    });
});


var server = app.listen(8080,function(){
  console.log('Service Running...');
});