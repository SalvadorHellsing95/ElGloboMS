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
    connection.query("SELECT * FROM vwCarrito WHERE usuario=" + mysql.escape(user_n) ,function(err,result,fields)
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

    connection.query("SELECT * FROM vwPastel",function(err,result,fields)
    {
       if(err) throw err;
       console.log("Pastel Query");
       res.send(result);
    });

});
//Busqueda de Pasteles por Cubierta.
app.get('/Search/Cubierta',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    var CubID=req.query.cubierta;

    connection.query("SELECT * FROM vwPastel WHERE cubierta="+mysql.escape(CubID),function(err,result,fields)
    {
        if(err) throw err;
        console.log("Search Cubierta "+CubID);
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
        connection.query("SELECT count(*) as count FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
        {
           if(err){
            throw err;  
           }else{

                console.log("Reporte Step 1");
                //Se utiliza para usar json con texto plano.
                Aut=result[0].count;
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
});

//Agregar Usuarios.
app.post('/add/user',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    var Aux;
    var correo =req.body.correo;
    var contrasena=req.body.contrasena;
    var aPaterno=req.body.aPaterno;
    var aMaterno=req.body.aMaterno;
    var nombre=req.body.nombre;  
    var direccion=req.body.direccion;
    var SQL="INSERT INTO Usuario(nombre,aPaterno,aMaterno,correo,contrasena,administrador,direccion) VALUES("+mysql.escape(nombre)+","+mysql.escape(aPaterno)+","+mysql.escape(aMaterno)+
    ","+mysql.escape(correo)+","+mysql.escape(contrasena)+","+"0"+","+mysql.escape(direccion)+");";
    connection.query("SELECT count(*) as count FROM Usuario where correo="+mysql.escape(correo),function(err,result,fields)
    {
        if(err)
        {
            throw err;
        }else{
            Aux=result[0].count;
            console.log(Aux);
            if(Aux==0)
            {
               

                connection.query(SQL,function(err,result,fields)
                {
                    if(err)
                    {
                        throw err;
                    }else{
                        res.send('OK');
                    }
                });
            }else{
                res.send('ALREADY EXISTS');
            }
            
        }
    });
    
});

//Agregar Pasteles
app.post('/add/pasteles',function(req,res)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    var user_n = req.body.correo;;
    var contras=req.body.contra;
    var nombre =req.body.nombre;
    var saborID=req.body.saborID;
    var tipoID=req.body.tipoID;
    var precio=req.body.precio;
    var cubiertaID=req.body.cubiertaID;
    var tamanoID=req.body.tamanoID;
    var existencias=req.body.existencias;
    var clave=req.body.clave;
    var imgRef=req.body.imgRef;

    var SQL="INSERT INTO Pastel(nombre, saborID, tipoID, precio, cubiertaID, tamanoID, existencias, clave, imgRef) VALUES("+
    mysql.escape(nombre)+','+mysql.escape(saborID)+','+mysql.escape(tipoID)+','+mysql.escape(precio)+','+mysql.escape(cubiertaID)+','+mysql.escape(tamanoID)+','+
    mysql.escape(existencia)+','+mysql.escape(clave)+','+mysql.escape(imgRef)+");";

    connection.query("SELECT count(*) as count FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
        {
           if(err){
            throw err;  
           }else{

                console.log("Insert Pas Step 1");
                //Se utiliza para usar json con texto plano.
                Aut=result[0].count;
                if(Aut!=0)
                {
                    connection.query("SELECT administrador FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
                {
                    if(err){
                        throw err;
                    }else{
                        console.log("Insert Pas Step 2");
                        Adm=parseInt(result[0].administrador);
                        if(Adm==1)
                        {
                            connection.query(SQL,function(err,result,fields)
                        {
                            if(err) throw err;
                            res.send("Ok");
                        });
                        }else{
                            console.log("Algo paso mal :c");
                        }
                        //console.log("Reporte Final Step");
                    }   
                });
                }
            }
        });
    
});
//Insertar Cubierta
app.post('/add/cubierta',function(req,res)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    var user_n = req.body.correo;;
    var contras=req.body.contra;
    var nombre=req.body.nombre;

    var SQL="INSERT INTO Cubierta(nombre) VALUES("+
    mysql.escape(nombre)+");";

    connection.query("SELECT count(*) as count FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
        {
           if(err){
            throw err;  
           }else{

                console.log("Insert Cub Step 1");
                //Se utiliza para usar json con texto plano.
                Aut=result[0].count;
                if(Aut!=0)
                {
                    connection.query("SELECT administrador FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
                {
                    if(err){
                        throw err;
                    }else{
                        console.log("Insert Cub Step 2");
                        Adm=parseInt(result[0].administrador);
                        if(Adm==1)
                        {
                            connection.query(SQL,function(err,result,fields)
                        {
                            if(err) throw err;
                            res.send("Ok");
                        });
                        }else{
                            console.log("Algo paso mal :c");
                        }
                        //console.log("Reporte Final Step");
                    }   
                });
                }
            }
        });
    
});

//Insertar Sabor.
app.post('/add/sabor',function(req,res)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    var user_n = req.body.correo;;
    var contras=req.body.contra;
    var nombre=req.body.nombre;

    var SQL="INSERT INTO Sabor(nombre) VALUES("+
    mysql.escape(nombre)+");";

    connection.query("SELECT count(*) as count FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
        {
           if(err){
            throw err;  
           }else{

                console.log("Insert Cub Step 1");
                //Se utiliza para usar json con texto plano.
                Aut=result[0].count;
                if(Aut!=0)
                {
                    connection.query("SELECT administrador FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
                {
                    if(err){
                        throw err;
                    }else{
                        console.log("Insert Cub Step 2");
                        Adm=parseInt(result[0].administrador);
                        if(Adm==1)
                        {
                            connection.query(SQL,function(err,result,fields)
                        {
                            if(err) throw err;
                            res.send("Ok");
                        });
                        }else{
                            console.log("Algo paso mal :c");
                        }
                        //console.log("Reporte Final Step");
                    }   
                });
                }
            }
        });
    
});

//Insertar Tipo.
app.post('/add/tipo',function(req,res)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    var user_n = req.body.correo;;
    var contras=req.body.contra;
    var nombre=req.body.nombre;

    var SQL="INSERT INTO Tipo(nombre) VALUES("+
    mysql.escape(nombre)+");";

    connection.query("SELECT count(*) as count FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
        {
           if(err){
            throw err;  
           }else{

                console.log("Insert Cub Step 1");
                //Se utiliza para usar json con texto plano.
                Aut=result[0].count;
                if(Aut!=0)
                {
                    connection.query("SELECT administrador FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
                {
                    if(err){
                        throw err;
                    }else{
                        console.log("Insert Cub Step 2");
                        Adm=parseInt(result[0].administrador);
                        if(Adm==1)
                        {
                            connection.query(SQL,function(err,result,fields)
                        {
                            if(err) throw err;
                            res.send("Ok");
                        });
                        }else{
                            console.log("Algo paso mal :c");
                        }
                        //console.log("Reporte Final Step");
                    }   
                });
                }
            }
        });
    
});




var server = app.listen(8080,function(){
  console.log('Service Running...');
});