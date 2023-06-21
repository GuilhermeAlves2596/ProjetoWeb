var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { token } = require('morgan');
const sequelize = require("../helpers/bd")
var funcoes = require('../control/funcoes')
const aulaDAO = require('../model/aulas')
var admDAO = require("../model/ADM");

// Listar aulas disponiveis
router.get('/listAll', funcoes.validateToken, async (req, res) => {
    let aulas = await aulaDAO.list();
    res.json({status: true, msg:'Aulas disponiveis', aulas})
})

// Procurar uma aula 
router.get('/list/:id', funcoes.validateToken, async (req, res) => {
    let aula = await aulaDAO.getById(req.params.id)
    if(aula){
        res.json({status: true, msg:'Aula encontrada', aula})
    } else {
        res.status(500).json({status: false, msg: 'Aula não encontrada'});
    }

})

// Criar novas aulas
router.post('/create', funcoes.validateToken, funcoes.validateAula, async (req, res) => {

    const {data, horario, nome} = req.body

    aulaDAO.save(data, horario, nome).then(aula => {
        res.json({status: true, msg: 'Aula criada com sucesso'})
    }).catch(err => {
        console.log(err)
        res.status(500).json({status: false, msg: 'Erro ao cadastrar a aula'});
    })

})

// Alterar aulas
router.put('/update/:id', funcoes.validateToken, funcoes.validateAula, async (req, res) => {
    const {id} = req.params
    const {data, horario, nome} = req.body

    let [aula] = await aulaDAO.update(id, data, horario, nome)

    if(aula){
        res.json({status: true, msg: 'Aula alterada com sucesso'})
    } else {
        return res.status(500).json({status: false, msg:'Falha ao modificar a aula'})
    }
})

// Excluir aula
router.delete('/delete/:id', funcoes.validateToken, async (req, res) => {
    
    try {
        const aula = await aulaDAO.delete(req.params.id)
        if(aula) {
            res.json({status: true, msg: 'Aula excluida com sucesso'})
        } else {
            return res.status(500).json({status: false, msg:'Aula não encontrada'})
        }        
    } catch (error) {
        return res.status(500).json({status: false, msg:'Aula não encontrada'})
    }

})



module.exports = router;