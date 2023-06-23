var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { token } = require('morgan');
const sequelize = require("../helpers/bd")
var funcoes = require('../control/funcoes')
const instrutorDAO = require('../model/instrutores')
var admDAO = require("../model/ADM");

// Listar instrutores disponiveis - ADM
router.get('/listAll', funcoes.isADM, funcoes.limiteList, async (req, res) => {

    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    let instrutores = await instrutorDAO.list(page, limit);
    res.json({status: true, msg:'Instrutores cadastrados', instrutores})
})

// Listar instrutores disponiveis - usuarios
router.get('/user/listAll', funcoes.validateToken, funcoes.limiteList, async (req, res) => {

    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    let instrutores = await instrutorDAO.listUser(page, limit); // Listagem sem o salario
    res.json({status: true, msg:'Instrutores cadastrados', instrutores})
    
})

// Procurar instrutor por id - ADM
router.get('/list/:id', funcoes.isADM, async (req, res) => {

    let instrutor = await instrutorDAO.getById(req.params.id)
    if(instrutor) {
        res.json({status: true, msg:'Instrutor encontrado', instrutor})
    } else {
        res.status(500).json({status: false, msg: 'Instrutor não encontrado'});
    }

})

// Procurar instrutor por id - usuarios
router.get('/user/list/:id', funcoes.validateToken, async (req, res) => {

    let instrutor = await instrutorDAO.getById_User(req.params.id) // Consulta sem o salario
    if(instrutor) {
        res.json({status: true, msg:'Instrutor encontrado', instrutor})
    } else {
        res.status(500).json({status: false, msg: 'Instrutor não encontrado'});
    }
    
})

// Cadastrar novo instrutor
router.post('/create', funcoes.isADM, funcoes.validateInstrutor, async (req, res) => {
    
    const {nome, idade, genero, endereco, formado, salario, especialidade} = req.body
    instrutorDAO.save(nome, idade, genero, endereco, formado, salario, especialidade).then(instrutor => {
        res.json({status: true, msg: 'Instrutor cadastrado com sucesso'})
    }).catch(err => {
        console.log(err)
        res.status(500).json({status: false, msg: 'Erro ao cadastrar o instrutor'});
    })

})

// Alterar instrutor
router.put('/update/:id', funcoes.isADM, funcoes.validateInstrutor, async (req, res) => {

    const {id} = req.params
    const {nome, idade, genero, endereco, formado, salario, especialidade} = req.body

    let [instrutor] = await instrutorDAO.update(id, nome, idade, genero, endereco, formado, salario, especialidade)

    if(instrutor){
        res.json({status: true, msg: 'Instrutor alterado com sucesso'})
    } else {
        res.status(500).json({status: false, msg: 'Erro ao alterar o instrutor'});
    } 
})

// Excluir instrutor
router.delete('/delete/:id', funcoes.isADM, async (req, res) => {

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

})

module.exports = router;