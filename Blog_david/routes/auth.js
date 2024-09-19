const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    const { username, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).send('Las contraseñas no coinciden');
    }

    const queryCheckUser = 'SELECT * FROM usuarios WHERE email = ? OR username = ?';
    db.query(queryCheckUser, [email, username], async (err, result) => {
        if (err) return res.status(500).send('Error en la base de datos');

        if (result.length > 0) {
            return res.status(400).send('El usuario o correo ya existe');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const queryInsertUser = 'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)';
        db.query(queryInsertUser, [username, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).send('Error al registrar el usuario');
            req.session.user = { username, email};
            console.log(req.session);
            res.redirect('/');
        });
    });
});


router.post('/login', (req, res) => {
    const { login, password } = req.body;

    const queryCheckUser = 'SELECT * FROM usuarios WHERE email = ? OR username = ?';
    db.query(queryCheckUser, [login, login], (err, result) => {
        if (err) return res.status(500).send('Error en la base de datos');

        if (result.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const user = result[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).send('Error al comparar contraseñas');

            if (isMatch) {
                req.session.user = { username: user.username, email: user.email };
                console.log(req.session);
                res.redirect('/');
            } else {
                res.status(400).send('Contraseña incorrecta');
            }
        });
    });
});

router.get('/current-user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).send('No autenticado');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/');
    });
});

module.exports = router;
