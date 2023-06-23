var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { token } = require('morgan');
var userDAO = require("../model/usuarios");
var funcoes = require('../control/funcoes')

// Cadastro de novos usuarios
router.post('/cadUsuario', funcoes.validateToken, funcoes.validateUsuario, async (req, res) => {
    const {nome, idade, cpf, cidade, usuario, senha} = req.body

    const verificaUser = await userDAO.getUserByUsuario(usuario);
    if (verificaUser) {
        return res.status(403).json({ status: false, msg: 'Já existe um usuario cadastrado com esse nome de usuário' });
    }

    userDAO.save(nome, idade, cpf, cidade, usuario, senha).then(user => {
        res.json({status: true, msg:'Usuario cadastrado com sucesso'})
    }).catch(err => {
        console.log(err)
        res.status(500).json({status: false, msg: 'Não foi possivel cadastrar o usuario'})
    })
})

// Alterar os proprios dados
router.put("/altDados/:id", funcoes.validateToken, funcoes.validateUsuario, async (req, res) => {
    const userId = req.params.id;
    const user = req.query.usuario;
 
    const userName = await userDAO.getById(userId);
    if (!userName) return res.json({ status: false, msg: 'Usuário não encontrado' });
  
    if (userName.usuario === user) { // Verifica se o usuário está alterando seus próprios dados
        const { id } = req.params;
        const { nome, idade, cpf, cidade, usuario, senha } = req.body;
           
        let [result] = await userDAO.update(id, nome, idade, cpf, cidade, usuario, senha);
        console.log(result);
        if (result) {
            res.json({ status: true, msg: 'Dados alterados com sucesso' });
        } else {
            res.status(403).json({ status: false, msg: 'Falha ao alterar o usuário' });
        }
        } else {
        res.status(500).json({ status: false, msg: 'Você não tem permissão para alterar esses dados',
                                                ATENCAO:'Verifique se esta passando corretamente seu ID e Usuario na URL (1?usuario=*****)' });
    }
});

// Listar os proprios dados
router.get("/list/:id", funcoes.validateToken, async (req, res) => {
    const userId = req.params.id;
    const user = req.query.usuario;
 
    const userName = await userDAO.getById(userId);
    if (!userName) return res.json({ status: false, msg: 'Usuário não encontrado' });
  
    if (userName.usuario === user) { // Verifica se o usuário está visualizado seus próprios dados
        const { id } = req.params;
    
        const user = await userDAO.getById(id);
        res.json({ status: true, msg: "Usuário encontrado", user });

        } else {
        res.status(500).json({ status: false, msg: 'Você não tem permissão para visualizar esses dados',
                                                ATENCAO:'Verifique se esta passando corretamente seu ID e Usuario na URL (1?usuario=*****)' });
    }
});
 
module.exports = router;
