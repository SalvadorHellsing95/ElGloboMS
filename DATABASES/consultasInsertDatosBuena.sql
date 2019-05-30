USE PasteleriaDB;
-- SHOW FULL TABLES FROM PasteleriaDB;
-- SELECT * FROM Usuario;

INSERT INTO Tamano(nombre, numPersonas) VALUES('Chico', 8);
INSERT INTO Tamano(nombre, numPersonas) VALUES('Mediano', 16);
INSERT INTO Tamano(nombre, numPersonas) VALUES('Grande', 20);
INSERT INTO Tamano(nombre, numPersonas) VALUES('King', 25);
INSERT INTO Tamano(nombre, numPersonas) VALUES('Dios', 35);
INSERT INTO Sabor(nombre) VALUES('Vainilla');
INSERT INTO Sabor(nombre) VALUES('Chocolate');
INSERT INTO Sabor(nombre) VALUES('Fresa');
INSERT INTO Sabor(nombre) VALUES('Durazno');
INSERT INTO Sabor(nombre) VALUES('Piña');
INSERT INTO Sabor(nombre) VALUES('Nuez');
INSERT INTO Tipo(nombre) VALUES('Seco');
INSERT INTO Tipo(nombre) VALUES('Tres leches');
INSERT INTO Tipo(nombre) VALUES('Media leche');
INSERT INTO Tipo(nombre) VALUES('Empapado');
INSERT INTO Cubierta(nombre) VALUES('Merengue');
INSERT INTO Cubierta(nombre) VALUES('Fondant');
INSERT INTO Cubierta(nombre) VALUES('Glaseado');
INSERT INTO Cubierta(nombre) VALUES('Fruti Lupis');
INSERT INTO Pastel(nombre, descripcion, saborID, tipoID, precio, cubiertaID, tamanoID, existencias, clave, imgRef) VALUES('Rocket Mars', 'Pastel con diseño de cohetes espaciales y base estilo planeta Marte', 1, 2, 400.50, 2, 3, 12, 'RCKTMRS456', 'https://imageneslibres.org/carros/carcachas/carreta,jpg');
INSERT INTO Pastel(nombre, descripcion, saborID, tipoID, precio, cubiertaID, tamanoID, existencias, clave, imgRef) VALUES('Futbol', 'Pastel con diseño de cancha de futbol, ideal para fiesta de cumpleaños de niños o reuniones de equipos de futbol', 2, 1, 350.50, 2, 2, 12, 'RCKT4RS456', 'https://imageneslibres.org/carros/carcachas/carreta,jpg');
INSERT INTO Pastel(nombre, descripcion, saborID, tipoID, precio, cubiertaID, tamanoID, existencias, clave, imgRef) VALUES('Queroro', 'Pastel de origen desconocido, fue encontrado dentro de una roca que cayó del espacio y posteriormente clonado para su producción en masa', 3, 1, 400.50, 1, 3, 12, '6RCK5RS456', 'https://imageneslibres.org/carros/carcachas/carreta,jpg');

-- SELECT a.nombre, a.descripcion, c.nombre AS sabor, b.nombre AS tipo, a.precio, d.nombre AS cubierta, e.nombre AS tamaño, e.numPersonas AS numPerson, a.existencias, a.clave, a.imgRef FROM Pastel a, Tipo b, Sabor c, Cubierta d, Tamano e WHERE a.saborID = c.saborID AND a.tipoID = b.tipoID AND a.cubiertaID = d.cubiertaID AND a.tamanoID = e.tamanoID ;

-- __________________________________________-INSERT A USUARIO_________________________________________________
INSERT INTO Usuario(nombre, aPaterno, aMaterno, correo, contrasena, administrador, direccion) VALUES('Salvador', 'Gonzáles', 'Blanco', 'salvador.gonz@ugto.mx', '01Salvador', true , 'Los Arcos 1013');
INSERT INTO Usuario(nombre, aPaterno, aMaterno, correo, contrasena, administrador, direccion) VALUES('Jonathan', 'Rodríguez', 'Salazar', 'john.rodriguez@ugto.mx', '12Jonathan', false , '18 de Agosto 364');

-- __________________________________________-INSERT A CARRITO_________________________________________________
INSERT INTO Carrito(usuarioID, pastelID, cantidad)VALUES(1, 1, 4);

DROP VIEW IF EXISTS vwInfoUser;
DROP VIEW IF EXISTS vwPastel;
DROP VIEW IF EXISTS vwCarrito;
/*-- ______________________________________________________________________________________VISTA PASTEL*/
CREATE VIEW vwPastel AS
SELECT a.nombre, a.descripcion, c.nombre AS sabor, b.nombre AS tipo, a.precio, d.nombre AS cubierta, e.nombre AS tamano, e.numPersonas AS numPerson, a.existencias, a.clave, a.imgRef FROM Pastel a, Tipo b, Sabor c, Cubierta d, Tamano e WHERE a.saborID = c.saborID AND a.tipoID = b.tipoID AND a.cubiertaID = d.cubiertaID AND a.tamanoID = e.tamanoID ;
/*-- SELECT * FROM Cubierta;
-- SELECT * FROM Tipo;
-- SELECT * FROM Tamano;
-- SELECT * FROM Sabor;*/

/*-- _______________________________________________________________________________________VISTA CARRITO*/
CREATE VIEW vwCarrito AS
SELECT b.correo AS usuario, a.nombre AS pastel, c.cantidad 
FROM Pastel a, Usuario b, Carrito c
WHERE c.pastelID = a.pastelID AND c.usuarioID = b.usuarioID;

/*-- ________________________________________________________________________________________VISTA USUARIO*/
CREATE VIEW vwInfoUser AS
SELECT CONCAT(nombre, ' ', aPaterno,' ', aMaterno) AS nombre, correo, direccion, administrador
FROM Usuario;

SELECT * FROM vwPastel;
/*
DELETE FROM Carrito WHERE carritoID = [ID];
DELETE FROM Pastel WHERE pastelID = [ID];
DELETE FROM Usuario WHERE usuarioID = [ID];
DELETE FROM Sabor WHERE saborID = [ID];
DELETE FROM Tipo WHERE tipoID = [ID];
DELETE FROM Cubierta WHERE cubiertaID = [ID];
DELETE FROM Tamano WHERE tamanoID = [ID];

UPDATE Carrito SET [columna]=[valor] WHERE carritoID = [ID];
UPDATE Pastel SET [columna]=[valor] WHERE pastelID = [ID];
UPDATE Usuario SET [columna]=[valor] WHERE usuarioID = [ID];
UPDATE Sabor SET [columna]=[valor] WHERE saborID = [ID];
UPDATE Tipo SET [columna]=[valor] WHERE tipoID = [ID];
UPDATE Cubierta SET [columna]=[valor] WHERE cubiertaID = [ID];
UPDATE Tamano SET [columna]=[valor] WHERE tamanoID = [ID];

INSERT INTO Carrito([columna]) VALUES([valor]);
INSERT INTO Pastel([columna]) VALUES([valor]);
INSERT INTO Usuario([columna]) VALUES([valor]);
INSERT INTO Sabor([columna]) VALUES([valor]);
INSERT INTO Tipo([columna]) VALUES([valor]);
INSERT INTO Cubierta([columna]) VALUES([valor]);
INSERT INTO Tamano([columna]) VALUES([valor]);*/
