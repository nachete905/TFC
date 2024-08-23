DROP DATABASE IF EXISTS gestionVehiculos;
CREATE DATABASE gestionVehiculos CHARACTER SET utf8mb4;
use gestionVehiculos;

create table instalaciones(
    id_instalacion int auto_increment primary key,
    ubicacion varchar(50);
    telefono varchar(9);
    localidad varchar(50);
    principal boolean;
);

create table empresas(
    id_empresa int auto_increment primary key,
    instalaciones boolean default true;
    contacto varchar(50);
    CIF varchar(9);
    fecha_alta date;
    id_instalacion int;
    foreign key (id_instalacion) references instalaciones(id_instalacion);
);



create table usuario(
    id_usuario int auto_increment primary key,
    nombre varchar(50);
    apellido varchar(50);
    email varchar(50);
    telefono varchar(9);    
    passwd varchar(50);-- contraseña
    tipoUser int;
    
);

create table da_alta (
    id_instalacion INT,
    id_usuario INT,
    fecha_alta DATE,
    PRIMARY KEY (id_instalacion, id_usuario),
    FOREIGN KEY (id_instalacion) REFERENCES instalaciones(id_instalacion),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

/*puede almacenar datos binarios, como imágenes. Para insertar y recuperar la imagen, 
tendrías que convertir la imagen en un flujo de bytes antes de almacenarla y luego convertirla de nuevo en imagen al recuperarla.*/


create table documentacion_propieatario(
    id-documentacion int auto_increment primary key,
    nominas BLOB;
    carnet BLOB;
    DNI varchar(9);
);

create table documentacion_coche(
    id-documentacion int auto_increment primary key,
    permiso_circulacion BLOB;
    ficha_tecnica BLOB;
    ficha_verde BLOB;
    fecha_documentacion date;
    
);
create table compra_venta(
    id_compraVenta int auto_increment primary key,
    fecha date;
    comprador varchar(50);
    vendedor varchar(50);
    coche varchar(20);
    id_documentacioPropieatio int;
    id_documentacioCoche int;
    foreign key (id_documentacioPropieatio) references documentacion_propieatario(id-documentacion);
    foreign key (id_documentacioCoche) references documentacion_coche(id-documentacion);
);

create table coche(
    matricula varchar(20) primary key,
    marca varchar(20);
    modelo varchar(20);
    tipo_combustible varchar(20);
    tipo_cambio varchar(20);
    kilometraje int;
    año_matriculacion date;
    id_documentacioCoche int;
    id_compraVenta int;
    foreign key (id_documentacioCoche) references documentacion_coche(id-documentacion);
    foreign key (id_compraVenta) references compra_venta(id_compraVenta);
);


create table compra(
    id_usuario int;
    matricula varchar(20);
    foreign key (id_usuario) references usuario(id_usuario);
    foreign key (matricula) references coche(matricula);
);

create table venta(
    id_usuario int;
    matricula varchar(20);
    foreign key (id_usuario) references usuario(id_usuario);
    foreign key (matricula) references coche(matricula);
);


create table propieatario(
    id_propietario int auto_increment primary key,
    nombre varchar(50);
    apellido varchar(50);
    email varchar(50);
    telefono varchar(9);
    id_documentacion int;
    matricula varchar(20);
    foreign key (id_documentacion) references documentacion_propieatario(id-documentacion);
    foreign key (matricula) references coche(matricula);
);

