var express = require('express')
var jwt = require('jsonwebtoken');
const { token } = require('morgan');
var admDAO = require("../model/ADM");
var userDAO = require("../model/usuarios");
const sequelize = require('../helpers/bd');
var router = express.Router();

// Login ADM 
router.post('/login', async function(req, res) {
    const {user, password} = req.body

    const adm = await admDAO.consultaLogin(user, password)

    if(adm.length > 0){
        let token = jwt.sign({user: user}, '#Abcdefg', {
            expiresIn: '20 min'
        })
        res.json({status: true, token: token, msg:'Login efetuado com sucesso'})
    } else {
        res.status(403).json({status: false, msg: 'Usuario/Senha invalidos'})
    }
})

// Cadastro de novos ADM's
router.post('/cadAdm', validateToken, async(req, res) => {

    const {user, password} = req.body

    const adm = await admDAO.consultaLogin(user, password)
    if(adm.length > 0){
        await sequelize.sync()
        const {nome, idade, cpf, usuario, senha} = req.body

        admDAO.save(nome, idade, cpf, usuario, senha).then(adm => {
            res.json({status: true, msg:'Administrador cadastrado com sucesso'})
        }).catch(err => {
            console.log(err)
            res.status(500).json({status: false, msg: 'Não foi possivel cadastrar o administrador'})
        })
    } else {
        res.status(403).json({status: false, msg: 'Você não possui acesso ADM'})
    }

})


// Cadastro de novos usuarios
router.post('/cadUsuario', validateToken, async (req, res) => {
    await sequelize.sync()

    const {nome, idade, cpf, cidade, usuario, senha} = req.body

    userDAO.save(nome, idade, cpf, cidade, usuario, senha).then(user => {
        res.json({status: true, msg:'Usuario cadastrado com sucesso'})
    }).catch(err => {
        console.log(err)
        res.status(500).json({status: false, msg: 'Não foi possivel cadastrar o usuario'})
    })
})


// Alterar usuarios (apenas adm)
router.put("/altUsuario/:id", async (req, res) => {

    const {user, password} = req.body
    const adm = await admDAO.consultaLogin(user, password)

    if(adm.length > 0){
        const {id} = req.params
        const {nome, idade, cpf, cidade, usuario, senha} = req.body
    
        let [result] = await userDAO.update(id, nome, idade, cpf, cidade, usuario, senha)
        console.log(result)
        if (result)
            res.json({status: true, msg:'Usuario alterado com sucesso'})
        else
            res.status(403).json({status: false, msg: 'Falha ao alterar o usuario'})
    } else {
        res.status(500).json({status: false, msg: 'Você não possui acesso ADM'})
    }
})

// Exclusão de usuario não ADM
router.delete("/deleteUser/:id", validateToken, async (req, res) => {

    const {user, password} = req.body
    const adm = await admDAO.consultaLogin(user, password)

    if(adm.length > 0){
        let usuario = await userDAO.delete(req.params.id)
        if(usuario){
            res.json({status: true, msg:'Usuario excluido com sucesso'})
        } else {
            res.status(403).json({status: false, msg: 'Usuario não encontrado'})
        }
    } else {
        res.status(500).json({status: false, msg: 'Você não possui acesso ADM'})
    }
})


// Validação do token
function validateToken(req, res, next) {
    let token_full = req.headers['authorization']
    if (!token_full)
      token_full = ''
  
    jwt.verify(token_full, '#Abcdefg', (err, payload) => {
      if (err) {
        res.status(403).json({status: false, msg: "Acesso negado - Token invalido"})
        return
      }
      req.user = payload.user
      next()
    })
}


module.exports = router;