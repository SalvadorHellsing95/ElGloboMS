var express = require("express");
var app=express();
var path=require("path");
var excel = require("exceljs");
var usuario;
const mysql = require("mysql");

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
//Consulta Carrito
app.post('/carrito',function(req,res)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');

    //Se procede a identificar al usuario.
    var user_n =req.body.correo;
    var contras=req.body.contra;
    var Aut;
    connection.query("SELECT count(*) FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
    {
       if(err) throw err;
       console.log("Carrito Step 1");
        //Se utiliza para usar json con texto plano.
       Aut=result;
    });
    if(Aut!=0)
    {
      
    //Se consulta el Carrito
    connection.query("SELECT * FROM VWCarrito WHERE correo=" + mysql.escape(user_n) ,function(err,result,fields)
    {
       if(err) throw err;
       console.log("Carrito Step 2");
        //Se utiliza para usar json con texto plano.
       res.send(result);
    });
    }
});

//Consulta de Pasteles
app.get('/pasteles',function(req,res)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');

    connection.query("SELECT * FROM Pastel",function(err,result,fields)
    {
       if(err) throw err;
       console.log("Pastel Query");
       res.send(result);
    });

});
//Busqueda de Pasteles por Cubierta.
app.get('/Search/Cubierta',function(req,res){
    var CubID=req.query.cubierta_id;

    connection.query("SELECT * FROM Pastel WHERE cubiertaID="+mysql.escape(CubID),function(err,result,fields)
    {
        if(err) throw err;
        console.log("Search Cubierta");
        res.send(result);
    });
});

//Prueba de envio de archivos.
app.post('/send',function(req,res){


        //Se utiliza para usar json con texto plano.
        res.header("Access-Control-Allow-Origin", "*");
        res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    
        var user_n =req.body.correo;
        var contras=req.body.contra;
        var Aut,Adm;
        connection.query("SELECT count(*) FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
        {
           if(err){
            throw err;  
           }else{

                console.log("Reporte Step 1");
                //Se utiliza para usar json con texto plano.
                Aut=result;
                if(Aut!=0)
                {
                    connection.query("SELECT administrador FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
                {
                    if(err){
                        throw err;
                    }else{
                        console.log("Reporte Step 2");
                        Adm=parseInt(result[0].administrador);
                        if(Adm==1)
                        {
                        console.log("Reporte Step 3");
                        }else{
                        console.log("Algo paso mal :c");
                        }
                        res.sendFile(__dirname + '/Prueba.xls')
                        //console.log("Reporte Final Step");
                    }   
                });
                }
            }
        });
        
//             var workbook = new excel.Workbook();
//             var sheet = workbook.addWorksheet('MySheet');

//             connection.query("SELECT * FROM Pastel",function(err,result,fields)
//             {
//                 if(err) throw err;
//                 console.log("Reporte Step 3");
//                 Aut=result;
//             });
//             sheet.addRow().values=Object.keys(Aut[0]);
            
//             Aut.forEach(function(item){
//                 var valueArray=[];
//                 valueArray=Object.values(item);
//                 sheet.addWRow.values=valueArray;
//             });

//             var tempfile = require('tempfile');
//             var tempFilePath = tempfile('.xlsx');
//             console.log("tempFilePath : ", tempFilePath);
//             workbook.xlsx.writeFile(tempFilePath).then(function() {
//             res.sendFile(tempFilePath, function(err){
//             console.log('---------- error downloading file: ', err);
//              });
//             console.log('file is written');
// });
            



   // res.sendFile(path.join(__dirname + '/Prueba.xls'));
});


var server = app.listen(8080,function(){
  console.log('Service Running...');
});