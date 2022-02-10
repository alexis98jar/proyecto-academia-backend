const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');



const crearUsuario = async(req, res = response) => {
    
    const {email, password} = req.body;
    
    try {
        
        let usuario = await Usuario.findOne({ email});
        // console.log(usuario)

        if ( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            })
        }
        usuario = new Usuario( req.body);

        //encryptar pass
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
    
        await usuario.save();
        
        //JWT
        const token = await generarJWT(usuario.id, usuario.name);
        
        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}


const login = async(req, res = response) => {

    const {email, password} = req.body;

    try {
        
        let usuario = await Usuario.findOne({ email });

        if ( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Hubo un problema con el usuario o contraseña'
            })
        }

        //Confirmar los passwords
        const validarPassword = bcrypt.compareSync( password, usuario.password); //retorna true o false

        if( !validarPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

    // res.status(201).json({
    //     ok:true,
    //     msg: 'login',
    //     email,
    //     password
    // });
}

const renovarToken = async(req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    //Generar nuevo JWT y retornarlo en esta peticion
    const token = await generarJWT(uid,name);

    
    res.json({
        ok:true,
        uid,
        name,
        token
    });
}

module.exports = {
    login,
    crearUsuario,
    renovarToken
}