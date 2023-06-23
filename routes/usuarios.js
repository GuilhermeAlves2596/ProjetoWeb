var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { token } = require('morgan');
const sequelize = require("../helpers/bd")
var userDAO = require("../model/usuarios");
var funcoes = require('../control/funcoes')

// Login usuario
router.post('/login', funcoes.validateLogin, async (req, res) => {
    const {user, password} = req.body

    const usuario = await userDAO.consultaLogin(user, password)

    if(usuario.length > 0){
        let token = jwt.sign({user: user, password: password}, process.env.DB_TOKEN, {
            expiresIn: '1h'
        })
        res.json({status: true, token: token, msg:'Login efetuado com sucesso'})
    } else {
        res.status(403).json({status: false, msg: 'Usuario/Senha invalidos'})
    }
})

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

      const verificaUser = await userDAO.getUserByUsuario(usuario);
      if (verificaUser) {
          return res.status(403).json({ status: false, msg: 'Já existe um usuario cadastrado com esse nome de usuário' });
      }
  
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
 
module.exports = router;
