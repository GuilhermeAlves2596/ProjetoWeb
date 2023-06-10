var express = require('express')
var jwt = require('jsonwebtoken');
const { token } = require('morgan');
var admDAO = require("../model/ADM");
var router = express.Router();

// Login ADM 
router.post('/login/adm', async function(req, res) {
    const {user, password} = req.body

    const usuario = await admDAO.consultaLogin(user, password)

    if(usuario.length > 0){
        let token = jwt.sign({user: user}, '#Abcdefg', {
            expiresIn: '20 min'
        })
        res.json({status: true, token: token, msg:'Login efetuado com sucesso'})
    } else {
        res.status(403).json({status: false, msg: 'Usuario/Senha invalidos'})
    }
})

// Parei aqui, necessario criar rotas de login para usuarios, criar a tabela de usuarios...

module.exports = router;