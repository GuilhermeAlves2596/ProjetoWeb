var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { token } = require('morgan');
const sequelize = require("../helpers/bd")
var funcoes = require('../control/funcoes')
const instrutorDAO = require('../model/instrutores')
var admDAO = require("../model/ADM");

// Listar instrutores disponiveis
router.get('/listAll', funcoes.validateToken, funcoes.validateLogin, async (req, res) => {
    const {user, password} = req.body
    const adm = await admDAO.consultaLogin(user, password)
    let instrutores;

    if(adm.length > 0){
        instrutores = await instrutorDAO.list();
        res.json({status: true, msg:'Instrutores cadastrados', instrutores})
    } else {
        instrutores = await instrutorDAO.listUser(); // Se realizer o login com usuario, não irá aparecer o salário do instrutor
        res.json({status: true, msg:'Instrutores cadastrados', instrutores})
    }
})

// Procurar instrutor por id
router.get('/list/:id', funcoes.validateToken, funcoes.validateLogin, async (req, res) => {
    const {user, password} = req.body
    const adm = await admDAO.consultaLogin(user, password)
    let instrutor;

    if(adm.length > 0) {
        instrutor = await instrutorDAO.getById(req.params.id)
        if(instrutor) {
            res.json({status: true, msg:'Instrutor encontrado', instrutor})
        } else {
            res.status(500).json({status: false, msg: 'Instrutor não encontrado'});
        }
    } else {
        instrutor = await instrutorDAO.getById_User(req.params.id) // Se realizer o login com usuario, não irá aparecer o salário do instrutor
        if(instrutor) {
            res.json({status: true, msg:'Instrutor encontrado', instrutor})
        } else {
            res.status(500).json({status: false, msg: 'Instrutor não encontrado'});
        }
    }
})

// Cadastrar novo instrutor
router.post('/create', funcoes.validateToken, funcoes.validateLogin, funcoes.validateInstrutor, async (req, res) => {
    const {user, password} = req.body
    const adm = await admDAO.consultaLogin(user, password)

    
    if(adm.length > 0){
        const {nome, idade, genero, endereco, formado, salario, especialidade} = req.body
        instrutorDAO.save(nome, idade, genero, endereco, formado, salario, especialidade).then(instrutor => {
            res.json({status: true, msg: 'Instrutor cadastrado com sucesso'})
        }).catch(err => {
            console.log(err)
            res.status(500).json({status: false, msg: 'Erro ao cadastrar o instrutor'});
        })
    } else {
        res.status(403).json({status: false, msg: 'Você não possui acesso ADM'})
    }

})

// Alterar instrutor
router.put('/update/:id', funcoes.validateToken, funcoes.validateLogin, funcoes.validateInstrutor, async (req, res) => {
    const {user, password} = req.body
    const adm = await admDAO.consultaLogin(user, password)

    if(adm.length > 0) {
        const {id} = req.params
        const {nome, idade, genero, endereco, formado, salario, especialidade} = req.body

        let [instrutor] = await instrutorDAO.update(id, nome, idade, genero, endereco, formado, salario, especialidade)

        if(instrutor){
            res.json({status: true, msg: 'Instrutor alterado com sucesso'})
        } else {
            res.status(500).json({status: false, msg: 'Erro ao alterar o instrutor'});
        } 
    } else {
        res.status(403).json({status: false, msg: 'Você não possui acesso ADM'})
    }

})

// Excluir instrutor
router.delete('/delete/:id', funcoes.validateToken, funcoes.validateLogin, async (req, res) => {
    const {user, password} = req.body
    const adm = await admDAO.consultaLogin(user, password)

    if(adm.length > 0){
        try {
            const instrutor = await instrutorDAO.delete(req.params.id)
            if(instrutor) {
                res.json({status: true, msg: 'Instrutor excluido com sucesso'})
            } else {
                res.status(500).json({status: false, msg: 'Erro ao excluir o instrutor'});
            }   
        } catch (error) {
            res.status(500).json({status: false, msg: 'Instrutor não encontrado'});
        }
    } else {
        res.status(403).json({status: false, msg: 'Você não possui acesso ADM'})
    }

})

module.exports = router;