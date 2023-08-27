/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/


const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/fieldValidator');
const { JWTValidator } = require('../middlewares/JWTValidator');
const router =  Router()

router.post(
    '/new', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password  debe de ser de 6 caracteres').isLength({min:6}),
        fieldValidator
    ], 
    createUser)

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password  debe de ser de 6 caracteres').isLength({min:6}),
        fieldValidator
    ],
    loginUser)

router.get('/renew', JWTValidator, renewToken)

module.exports = router