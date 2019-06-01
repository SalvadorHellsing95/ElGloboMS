var express = require("express");
var app=express();
var session = require('express-session');
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

app.use(session({ 
    secret: 'keyboard cat', 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

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
    connection.query("SELECT count(*) as count FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena= MD5(" +mysql.escape(contras)+")",function(err,result,fields)
    {
       if(err){
        throw err;
       }else{
        console.log("User Login Step 1 ");
        //Se utiliza para usar json con texto plano.
       Aut=result[0].count;;
        if(Aut!=0)
        {
           connection.query("SELECT * FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena= MD5(" +mysql.escape(contras)+")",function(err,result2,fields)
        {
           if(err) throw err;
           req.session.loggedid=true;
           req.session.username=user_n;
           req.session.contra=contras;
           console.log("User Login Step 2" + req.session.username);
           res.send(result2);

           //res.redirect("/home")
        }); 
        }else{
            console.log()
            res.send("No User");
        }
       } 
       
    });
    
});

app.get('/home',function(req,res)
{
    console.log('Redirected to /home :D '+req.session.username +' '+ req.session.contra);
    if(req.session.loggedid)
    {
        res.send('Welcome '+ req.session.username);
    }else{
        res.send('No Logged');
    }
    res.end();
    
});

app.get('/cubiertas',function(req,res)
{
    //Se utiliza para usar json con texto plano.
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    req.session.loggedid=true;
    req.session.username='prueba';
    req.session.contra='true';
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
    connection.query("SELECT count(*) FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena= MD5(" +mysql.escape(contras)+")",function(err,result,fields)
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
app.get('/search/cubierta',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    var CubID=req.query.cubierta;

    connection.query("SELECT * FROM vwPastel WHERE cubierta LIKE "+mysql.escape(CubID)+"%'",function(err,result,fields)
    {
        if(err) throw err;
        console.log("Search Cubierta "+CubID);
        res.send(result);
    });
});

//Busqueda de Pasteles por Pastel
app.get('/search/pastel',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    var CubID=req.query.pastel;

    connection.query("SELECT * FROM vwPastel WHERE nombre LIKE "+mysql.escape(CubID),function(err,result,fields)
    {
        if(err) throw err;
        console.log("Search Pastel "+CubID);
        res.send(result);
    });
});

//Busqueda de Pasteles por Sabor
app.get('/search/sabor',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    var CubID=req.query.sabor;

    connection.query("SELECT * FROM vwPastel WHERE sabor LIKE "+mysql.escape(CubID),function(err,result,fields)
    {
        if(err) throw err;
        console.log("Search Sabor "+CubID);
        res.send(result);
    });
});



//Prueba de envio de archivos.
// app.post('/send',function(req,res){


//         //Se utiliza para usar json con texto plano.
//         res.header("Access-Control-Allow-Origin", "*");
//         res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    
//         var user_n =req.body.correo;
//         var contras=req.body.contra;
//         var Aut,Adm;
//         connection.query("SELECT count(*) as count FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
//         {
//            if(err){
//             throw err;  
//            }else{

//                 console.log("Reporte Step 1");
//                 //Se utiliza para usar json con texto plano.
//                 Aut=result[0].count;
//                 if(Aut!=0)
//                 {
//                     connection.query("SELECT administrador FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=" +mysql.escape(contras),function(err,result,fields)
//                 {
//                     if(err){
//                         throw err;
//                     }else{
//                         console.log("Reporte Step 2");
//                         Adm=parseInt(result[0].administrador);
//                         if(Adm==1)
//                         {
//                         console.log("Reporte Step 3");
//                         }else{
//                         console.log("Algo paso mal :c");
//                         }
//                         res.sendFile(__dirname + '/Prueba.xls')
//                         //console.log("Reporte Final Step");
//                     }   
//                 });
//                 }
//             }
//         });
// });

app.get('/send',function(req,res){


    //Se utiliza para usar json con texto plano.
    console.log("Send");
    res.download('./reporte.pdf');    
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
    ","+mysql.escape(correo)+",MD5("+mysql.escape(contrasena)+"),"+"0"+","+mysql.escape(direccion)+");";
    connection.query("SELECT count(*) as count FROM Usuario where correo="+mysql.escape(correo),function(err,result,fields)
    {
        console.log(correo+contrasena+aPaterno+aMaterno+nombre+direccion+nombre+direccion);
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

app.post('/add/carrito',function(req,res)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    var user_n = req.body.correo;
    var contras=req.body.contra;
    var pastel=req.body.pastel;
    var cantidad=req.body.cantidad;
    var SQL,Aut;
    var usuarioID;
    connection.query("SELECT count(*) as count FROM Usuario WHERE correo="+mysql.escape(user_n)+" AND contrasena= MD5("+mysql.escape(contras)+")",function(err,result,fields){
        if(err)
        {
            throw err;
        }else{
            Aut=result[0].count;
            console.log("Add Carrito Step 1");

            if(Aut!=0)
            {
                connection.query("SELECT usuarioID FROM Usuario WHERE correo="+mysql.escape(user_n),function(err,result,fields)
                {
                    if(err)
                    {
                        throw err;
                    }else{
                        console.log("Add Carrito Step 2");
                        usuarioID=result;
                        SQL="INSERT INTO Carrito(usuarioID,pastelID,cantidad) VALUES("+mysql.escape(usuarioID)+","+mysql.escape(pastel)+","+mysql.escape(cantidad)+")";
                        connection.query(SQL,function(err,result,fields)
                        {
                            if(err)
                            {
                                throw err;
                            }else{
                                res.send("OK");
                                SQL="SELECT existencias FROM Pastel WHERE pastelID="+mysql.escape(pastel);
  
                                connection.query(SQL,function(err,result,fields)
                                {
                                if(err)
                                {
                                    throw err;
                                }else{
                                    Aut=result[0].existencias;
                                    Aut=Aut-cantidad;
                                    SQL="UPDATE Pastel SET existencias="+mysql.escape(Aut.toString)+"WHERE pastelID="+mysql.escape(pastel);
                                    connection.query(SQL,function(err,result,fields){
                                        if(err) throw err;
                                    });
                                }
                                
                                });
                            }
                        });

                        
                    }
                });
            }else{
                res.send("No User");
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
    var existencia=req.body.existencias;
    var clave=req.body.clave;
    var imgRef=req.body.imgRef;
    var descripcion="Otro pastel";

    var SQL="INSERT INTO Pastel(nombre,descripcion, saborID, tipoID, precio, cubiertaID, tamanoID, existencias, clave, imgRef) VALUES("+
    mysql.escape(nombre)+','+mysql.escape(descripcion)+','+mysql.escape(saborID)+','+mysql.escape(tipoID)+','+mysql.escape(precio)+','+mysql.escape(cubiertaID)+','+mysql.escape(tamanoID)+','+
    mysql.escape(existencia)+','+mysql.escape(clave)+','+mysql.escape(imgRef)+");";

    connection.query("SELECT count(*) as count FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena= MD5(" +mysql.escape(contras)+")",function(err,result,fields)
        {
           if(err){
            throw err;  
           }else{

                console.log("Insert Pas Step 1");
                //Se utiliza para usar json con texto plano.
                Aut=result[0].count;
                if(Aut!=0)
                {
                    connection.query("SELECT administrador FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena= MD5(" +mysql.escape(contras)+")",function(err,result,fields)
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
                            res.send("No admin");
                            console.log("Algo paso mal :c");
                        }
                        //console.log("Reporte Final Step");
                    }   
                });
                }else{
                    res.send("No user");
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

    connection.query("SELECT count(*) as count FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena=MD5(" +mysql.escape(contras)+")",function(err,result,fields)
        {
           if(err){
            throw err;  
           }else{

                console.log("Insert Cub Step 1");
                //Se utiliza para usar json con texto plano.
                Aut=result[0].count;
                if(Aut!=0)
                {
                    connection.query("SELECT administrador FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena= MD5(" +mysql.escape(contras)+")",function(err,result,fields)
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
                            res.send("No Existe usuario de Administrador");
                            console.log("Algo paso mal :c");
                        }
                        //console.log("Reporte Final Step");
                    }   
                });
                }else{
                    res.send("No existe Usuario");
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

    connection.query("SELECT count(*) as count FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena= MD5(" +mysql.escape(contras)+")",function(err,result,fields)
        {
           if(err){
            throw err;  
           }else{

                console.log("Insert Sab Step 1");
                //Se utiliza para usar json con texto plano.
                Aut=result[0].count;
                if(Aut!=0)
                {
                    connection.query("SELECT administrador FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena= MD5(" +mysql.escape(contras)+")",function(err,result,fields)
                {
                    if(err){
                        throw err;
                    }else{
                        console.log("Insert Sab Step 2");
                        Adm=parseInt(result[0].administrador);
                        if(Adm==1)
                        {
                            connection.query(SQL,function(err,result,fields)
                        {
                            if(err) throw err;
                            res.send("Ok");
                        });
                        }else{
                            res.send("No Existe usuario de Administrador");
                            
                            console.log("Algo paso mal :c");
                        }
                        //console.log("Reporte Final Step");
                    }   
                });
                }else{
                    res.send("No existe Usuario");
                }
            }
        });
    
});

//Insertar Tipo.
app.post('/add/tipo',function(req,res)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type','text/html; charset=utf-8mb4');
    var user_n = req.body.correo;
    var contras=req.body.contra;
    var nombre=req.body.nombre;

    var SQL="INSERT INTO Tipo(nombre) VALUES("+
    mysql.escape(nombre)+");";

    connection.query("SELECT count(*) as count FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena= MD5(" +mysql.escape(contras)+")",function(err,result,fields)
        {
           if(err){
            throw err;  
           }else{

                console.log("Insert tip Step 1");
                //Se utiliza para usar json con texto plano.
                console.log(user_n +" "+contras+" " + " "+ nombre);
                Aut=result[0].count;
                if(Aut!=0)
                {
                    connection.query("SELECT administrador FROM Usuario WHERE correo=" + mysql.escape(user_n) + " AND contrasena= MD5(" +mysql.escape(contras)+")",function(err,result,fields)
                {
                    if(err){
                        throw err;
                    }else{
                        console.log("Insert Tip Step 2");
                        Adm=parseInt(result[0].administrador);
                        if(Adm==1)
                        {
                            connection.query(SQL,function(err,result,fields)
                        {
                            if(err) throw err;
                            res.send("Ok");
                        });
                        }else{
                            res.send("No Existe usuario de Administrador");
                            console.log("Algo paso mal :c");
                        }
                        //console.log("Reporte Final Step");
                    }   
                });
                }else{
                    res.send("No existe Usuario");
                }
            }
        });
    
});




var server = app.listen(8080,function(){
  console.log('Service Running...');
});