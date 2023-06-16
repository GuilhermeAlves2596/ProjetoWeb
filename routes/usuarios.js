var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { token } = require('morgan');
const sequelize = require("../helpers/bd")
var admDAO = require("../model/ADM");
var userDAO = require("../model/usuarios");



// Login usuario
router.post('/login', async function(req, res) {
    const {user, password} = req.body

    const usuario = await userDAO.consultaLogin(user, password)

    if(usuario.length > 0){
        let token = jwt.sign({user: user}, '#Abcdefg', {
            expiresIn: '20 min'
        })
        res.json({status: true, token: token, msg:'Login efetuado com sucesso'})
    } else {
        res.status(403).json({status: false, msg: 'Usuario/Senha invalidos'})
    }
})

// Cadastro de usuarios
router.post('/cadUsuario', validateToken, async (req, res) => {
    await sequelize.sync()

    const {nome, idade, cpf, cidade, usuario, senha} = req.body

    userDAO.save(nome, idade, cpf, cidade, usuario, senha).then(user => {
        res.json({status: true, msg:'Usuario cadastrado com sucesso'})
    }).catch(err => {
        console.log(err)
        res.status(500).json(fail('Não foi possivel cadastrar o usuario'))
    })
})

// Alterar os proprios dados
router.put("/altDados/:id", async (req, res) => {
    const userId = req.params.id;
    const { user } = req.body;
  
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
      res.status(500).json({ status: false, msg: 'Você não tem permissão para alterar esses dados' });
    }
  });
  


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
