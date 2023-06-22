var express = require('express')
var jwt = require('jsonwebtoken');
const { token } = require('morgan');
var admDAO = require("../model/ADM");
var userDAO = require("../model/usuarios");
const sequelize = require('../helpers/bd');
var router = express.Router();
var funcoes = require('../control/funcoes')

// Listar ADM's
router.get('/listAll', funcoes.validateToken, funcoes.validateLogin, funcoes.limiteList, async (req, res) => {
    const {user, password} = req.body
    const adm = await admDAO.consultaLogin(user, password)

    if(adm.length > 0){
        const page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        const adms = await admDAO.list(page, limit);
        res.json({status: true, msg: "ADM's cadastrados", adms })
    } else {
        res.status(403).json({status: false, msg: 'Você não possui acesso ADM'})
    }

})

// Listar usuarios
router.get('/listUsers', funcoes.validateToken, funcoes.validateLogin, funcoes.limiteList, async (req, res) => {
    const { user, password } = req.body;
    const adm = await admDAO.consultaLogin(user, password);

    if (adm.length > 0) {
        const page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        const users = await userDAO.list(page, limit);
        res.json({ status: true, msg: "Usuários cadastrados", users });
    } else {
        res.status(403).json({ status: false, msg: 'Você não possui acesso ADM' });
    }
});


// Login ADM 
router.post('/login', funcoes.validateLogin, async (req, res) => {
    const {user, password} = req.body

    const adm = await admDAO.consultaLogin(user, password)

    if(adm.length > 0){
        let token = jwt.sign({user: user}, '#Abcdefg', {
            expiresIn: '1h'
        })
        res.json({status: true, token: token, msg:'Login efetuado com sucesso'})
    } else {
        res.status(403).json({status: false, msg: 'Usuario/Senha invalidos'})
    }
})

// Cadastro de novos ADM's
router.post('/cadAdm', funcoes.validateToken, funcoes.validateLogin, funcoes.validateADM, async(req, res) => {

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
router.post('/cadUsuario', funcoes.validateToken, funcoes.validateUsuario, async (req, res) => {
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
router.put("/altUsuario/:id", funcoes.validateToken, funcoes.validateUsuario, funcoes.validateLogin, async (req, res) => {

    const {user, password} = req.body
    const adm = await admDAO.consultaLogin(user, password)

    try {
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
    } catch (error) {
        res.status(500).json({status: false, msg: 'Usuário não encontrado'})
    }

})

// Exclusão de usuario não ADM
router.delete("/deleteUser/:id", funcoes.validateToken, funcoes.validateLogin, async (req, res) => {

    const {user, password} = req.body
    const adm = await admDAO.consultaLogin(user, password)

    try {
        if(adm.length > 0){
            let usuario = await userDAO.delete(req.params.id)
            if(usuario){
                res.json({status: true, msg:'Usuário excluido com sucesso'})
            } else {
                res.status(403).json({status: false, msg: 'Erro ao excluir o usuário'})
            }
        } else {
            res.status(500).json({status: false, msg: 'Você não possui acesso ADM'})
        }       
    } catch (error) {
        res.status(500).json({status: false, msg: 'Usuário não encontrado'})
    }

})


module.exports = router;