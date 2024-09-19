const sql = require('mysql')

const coneccion = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog'
});

coneccion.connect((err) =>{
    if (err) throw err;
    console.log('se conecto a la base de datos');
})

module.exports = coneccion;