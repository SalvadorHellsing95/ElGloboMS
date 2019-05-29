DROP DATABASE IF EXISTS PasteleriaDB;
CREATE DATABASE PasteleriaDB;
USE PasteleriaDB;

CREATE TABLE Sabor
(
	saborID INT NOT NULL AUTO_INCREMENT,
    nombre NVARCHAR(20) NOT NULL, 
    PRIMARY KEY(saborID)
);

CREATE TABLE Tipo
(
	tipoID INT NOT NULL AUTO_INCREMENT,
    nombre NVARCHAR(20) NOT NULL,
    PRIMARY KEY(tipoID)
);

CREATE TABLE Cubierta
(
	cubiertaID INT NOT NULL AUTO_INCREMENT,
    nombre NVARCHAR(15) NOT NULL,
    PRIMARY KEY(cubiertaID)
);

CREATE TABLE Tamano
(
	tamanoID INT NOT NULL AUTO_INCREMENT,
    nombre NVARCHAR(15) NOT NULL,
    numPersonas INT NOT NULL,
    PRIMARY KEY(tamanoID)
);

CREATE TABLE Pastel
(
	pastelID INT NOT NULL AUTO_INCREMENT,
    nombre NVARCHAR(30) NOT NULL,
    saborID INT NOT NULL,
    tipoID INT NOT NULL,
    precio DOUBLE NOT NULL,
    cubiertaID INT NOT NULL,
    tamanoID INT NOT NULL,
    existencias INT NOT NULL,
    clave NVARCHAR(10) NOT NULL,
    imgRef VARCHAR(255) NOT NULL,
    PRIMARY KEY(pastelID),
    FOREIGN KEY(saborID) REFERENCES Sabor(SaborID),
    FOREIGN KEY(tipoID) REFERENCES Tipo(tipoID),
    FOREIGN KEY(cubiertaID) REFERENCES Cubierta(cubiertaID),
    FOREIGN KEY(tamanoID) REFERENCES Tamano(tamanoID)
);

CREATE TABLE Usuario
(
	usuarioID INT NOT NULL AUTO_INCREMENT,
    nombre NVARCHAR(30) NOT NULL,
    aPaterno NVARCHAR(30) NOT NULL,
    aMaterno NVARCHAR(30) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    contrasena CHAR(60) NOT NULL,
    administrador BOOL NOT NULL,
    direccion NVARCHAR(50) NOT NULL,
    PRIMARY KEY(usuarioID)
);

CREATE TABLE Carrito
(
	carritoID INT NOT NULL AUTO_INCREMENT,
    usuarioID INT NOT NULL,
    pastelID INT NOT NULL,
    cantidad INT NOT NULL,
    PRIMARY KEY(carritoID),
    FOREIGN KEY(usuarioID) REFERENCES Usuario(usuarioID),
    FOREIGN KEY(pastelID) REFERENCES Pastel(pastelID)
);