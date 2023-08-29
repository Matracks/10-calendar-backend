const { response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/UserModel');
const { generateJWT } = require('../helpers/jwt');


const createUser = async (req, res = response)=>{
    
    const { email, password } = req.body

    try {

        let user = await User.findOne({email})

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya existe'
            })
        }

        user = new User( req.body )

        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync()
        user.password = bcryptjs.hashSync( password, salt )

        await user.save()

        //Generar JWT
        const token = await generateJWT(user.id, user.name)

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el ADM'
        })
    }
}

const loginUser = async (req, res = response)=>{

    const { email, password } = req.body

    try {
        
        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Email incorrecto'
            })
        }

        const validPassword = bcryptjs.compareSync	( password, user.password )

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        //Generar JWT
        const token = await generateJWT(user.id, user.name)

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el ADM'
        })
    }

}

const renewToken = async (req, res = response)=>{

    const {uid, name} = req
   

    const token = await generateJWT(uid, name)

    res.json({
        ok: true,
        uid,
        name,
        token
    })

}


module.exports = {
    createUser,
    loginUser,
    renewToken
}