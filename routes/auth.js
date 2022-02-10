const {Router} = require('express');
const { check } = require('express-validator');
const { login, crearUsuario, renovarToken } = require('../controllers/auth');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();



router.post('/new', 
    [ //midlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio y de 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    crearUsuario 
);

router.post('/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio y de 6 caracteres').isLength({min:6}),
        validarCampos
    ], 
    login 
);

router.get('/renew', validarJWT, renovarToken);



module.exports = router;