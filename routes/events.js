/*
    Rutas de Eventos / Events
    host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/fieldValidator');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events")
const { JWTValidator } = require("../middlewares/JWTValidator");
const { isDate } = require('../helpers/isDate');
const router =  Router()

//Todas validadas por el JWT
router.use(JWTValidator)

//Obtener eventos
router.get('/', getEventos)

//Crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha final es obligatoria').custom( isDate ),
        fieldValidator
    ],crearEvento)

//Actualizar un evento por id
router.put('/:id',[
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha final es obligatoria').custom( isDate ),
        fieldValidator
    ], actualizarEvento)

//Elminar un evento por id
router.delete('/:id', eliminarEvento)

module.exports = router