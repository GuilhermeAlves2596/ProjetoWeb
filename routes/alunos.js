var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { token } = require('morgan');
const sequelize = require("../helpers/bd")
var funcoes = require('../control/funcoes')
const alunosDAO = require('../model/alunos')

// Listar alunos cadastrados
router.get('/listAll', funcoes.validateToken, async (req, res) => {
    let alunos = await alunosDAO.list();
    res.json({status: true, msg: 'Alunos cadastrados', alunos})
})

// Pesquisar alunos por ID
router.get('/list/:id', funcoes.validateToken, async (req, res) => {
    let aluno = await alunosDAO.getById(req.params.id)
    if(aluno) {
        res.json({status: true, msg: 'Aluno encontrado', aluno})
    } else {
        res.status(500).json({status: false, msg: 'Aluno não encontrado'});
    }
})

// Cadastrar aluno
router.post('/create', funcoes.validateToken, funcoes.validateAluno, async (req, res) => {
    const {nome, idade, genero, endereco, altura, peso} = req.body

    alunosDAO.save(nome, idade, genero, endereco, altura ,peso).then(aluno => {
        res.json({status: true, msg: 'Aluno cadastrado com sucesso'})
    }).catch(err => {
        console.log(err)
        res.status(500).json({status: false, msg: 'Erro ao cadastrar o aluno'});
    })
})

// Alterar aluno
router.put('/update/:id', funcoes.validateToken, funcoes.validateAluno, async (req, res) => {
    const {id} = req.params
    const {nome, idade, genero, endereco, altura, peso} = req.body

    let [aluno] = await alunosDAO.update(id, nome, idade, genero, endereco, altura, peso)
    
    if(aluno){
        res.json({status: true, msg: 'Aluno alterado com sucesso'})
    } else {
        return res.status(500).json({status: false, msg:'Aluno não encontrado'})
    }
})

// Excluir aluno
router.delete('/delete/:id', funcoes.validateToken, async (req, res) => {
    
    try{
        const aluno = await alunosDAO.delete(req.params.id)
        if(aluno) {
            res.json({status: true, msg: 'Aluno excluido com sucesso'})
        } else {
            return res.status(500).json({status: false, msg:'Falha ao excluir o aluno'})
        }
    } catch (erro) {
        return res.status(500).json({status: false, msg:'Aluno não encontrado'})
    }

})

module.exports = router;