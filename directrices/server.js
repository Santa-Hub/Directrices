// server.js - Archivo principal del servidor (Node.js + Express + MySQL)

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuración de conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambiar si se usa otro usuario de MySQL
  password: '', // Añadir contraseña si la tiene el usuario de MySQL
  database: 'registro_usuarios' // Nombre de la base de datos
});

// Conectar a MySQL
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conexión a MySQL establecida');

  // Crear tabla usuarios si no existe
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      apellidos VARCHAR(100) NOT NULL,
      edad INT NOT NULL,
      telefono VARCHAR(20) NOT NULL,
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error al crear tabla:', err);
      return;
    }
    console.log('Tabla usuarios verificada/creada');
  });
});

// Ruta para registrar un nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const { nombre, apellidos, edad, telefono } = req.body;

  // Validación básica
  if (!nombre || !apellidos || !edad || !telefono) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Insertar usuario en la base de datos
  const insertQuery = `
    INSERT INTO usuarios (nombre, apellidos, edad, telefono)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertQuery, [nombre, apellidos, edad, telefono], (err, result) => {
    if (err) {
      console.error('Error al registrar el usuario:', err);
      return res.status(500).json({ message: 'Error al registrar el usuario' });
    }

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuarioId: result.insertId
    });
  });
});

// Ruta para obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al consultar usuarios' });
    }

    res.status(200).json(results);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(Servidor ejecutándose en http://localhost:${PORT});
});