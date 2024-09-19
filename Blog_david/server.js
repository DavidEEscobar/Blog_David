const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const sesion = require('express-session');
const rutas = require('./routes/auth');
const server = express();
const PORT = 3000;

server.use(sesion({
    secret: 'ZSMEETDGTA', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

server.use(express.static(path.join(__dirname, 'public')));

server.use(bodyparser.json());
server.use(bodyparser.urlencoded({ extended : true }));

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});
server.get('/register', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'html', 'register.html'));
});
server.get('/login', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});


server.use('/', rutas);

server.listen(PORT, () =>{
    console.log('Pagina corriendo en http://localhost:' + PORT);
})