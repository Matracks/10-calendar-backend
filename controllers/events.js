const { response } = require("express");
const Evento = require("../models/EventoModel");

const getEventos = async(req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name')

    res.json({
        ok: true,
        eventos
    })

}

const crearEvento = async(req, res = response) => {

    const evento = new Evento( req.body )

    try {

        evento.user = req.uid

        const saveEvent = await evento.save()

        res.json({
            ok: true,
            saveEvent
        })
        
    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'hable con el adm'
        })
    }
}

const actualizarEvento = async(req, res = response) => {

    const eventoId = req.params.id
    const uid = req.uid

    try {

        const evento = await Evento.findById( eventoId )

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updateEvent = await Evento.findByIdAndUpdate( eventoId, newEvent, {new: true} )

        res.json({
            ok: true,
            event: updateEvent,
            msg: 'Actualziado'
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'hable con el adm'
        })
        
    }
}

const eliminarEvento = async(req, res = response) => {

    const eventoId = req.params.id
    const uid = req.uid

    try {

        const evento = await Evento.findById( eventoId )

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe'
            })
        }

        if ( evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios'
            })
        }

        const deleteEvent = await Evento.findByIdAndDelete( eventoId, evento )

        res.json({
            ok: true,
            event: deleteEvent,
            msg: 'Eliminado'
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'hable con el adm'
        })
        
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}