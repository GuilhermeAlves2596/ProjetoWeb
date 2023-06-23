var express = require('express')
var jwt = require('jsonwebtoken');
const { token } = require('morgan');
var admDAO = require("../model/ADM");
var userDAO = require("../model/usuarios");
var router = express.Router();
var funcoes = require('../control/funcoes')

// Listar ADM's
router.get('/listAll', funcoes.isADM, funcoes.limiteList, async (req, res) => {
    
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    const adms = await admDAO.list(page, limit);
    res.json({status: true, msg: "ADM's cadastrados", adms })

})

// Listar usuarios
router.get('/listUsers', funcoes.isADM, funcoes.limiteList, async (req, res) => {

    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    const users = await userDAO.list(page, limit);
    res.json({ status: true, msg: "Usuários cadastrados", users });

});


// Login ADM 
router.post('/login', funcoes.validateLogin, async (req, res) => {
    const {user, password} = req.body

    const adm = await admDAO.consultaLogin(user, password)

    if(adm.length > 0){
        let token = jwt.sign({user: user, password: password}, process.env.DB_TOKEN, {
            expiresIn: '1h'
        })
        res.json({status: true, token: token, msg:'Login efetuado com sucesso'})
    } else {
        res.status(403).json({status: false, msg: 'Usuario/Senha invalidos'})
    }
})

// Cadastro de novos ADM's
router.post('/cadAdm', funcoes.isADM, funcoes.validateADM, async (req, res) => {
    const { nome, idade, cpf, usuario, senha } = req.body;
  
    // Verificar se já existe um administrador cadastrado no banco de dados
    const verificaUser = await admDAO.getAdmByUsuario(usuario);
    if (verificaUser) {
      return res.status(403).json({ status: false, msg: 'Já existe um administrador cadastrado com esse usuário' });
    }
  
    admDAO
      .save(nome, idade, cpf, usuario, senha)
      .then((adm) => {
        res.json({ status: true, msg: 'Administrador cadastrado com sucesso' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ status: false, msg: 'Não foi possível cadastrar o administrador' });
      });
  });
  


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

// Alterar dados de ADM
router.put("/altADM/:id", funcoes.isADM, funcoes.validateADM, async (req, res) => {

    try {
        const {id} = req.params
        const {nome, idade, cpf, usuario, senha} = req.body
   
        let [result] = await admDAO.update(id, nome, idade, cpf, usuario, senha)
        console.log(result)
        if (result)
            res.json({status: true, msg:'ADM alterado com sucesso'})
        else
            res.status(403).json({status: false, msg: 'Falha ao alterar o ADM'})
    } catch (error) {
        res.status(500).json({status: false, msg: 'ADM não encontrado'})
    }

})


// Alterar usuarios (apenas adm)
router.put("/altUsuario/:id", funcoes.isADM, funcoes.validateUsuario, async (req, res) => {

    try {
        const {id} = req.params
        const {nome, idade, cpf, cidade, usuario, senha} = req.body
   
        let [result] = await userDAO.update(id, nome, idade, cpf, cidade, usuario, senha)
        console.log(result)
        if (result)
            res.json({status: true, msg:'Usuario alterado com sucesso'})
        else
            res.status(403).json({status: false, msg: 'Falha ao alterar o usuario'})
    } catch (error) {
        res.status(500).json({status: false, msg: 'Usuário não encontrado'})
    }

})

// Exclusão de usuario não ADM
router.delete("/deleteUser/:id", funcoes.isADM, async (req, res) => {

    try {
        let usuario = await userDAO.delete(req.params.id)
        if(usuario){
            res.json({status: true, msg:'Usuário excluido com sucesso'})
        } else {
            res.status(403).json({status: false, msg: 'Erro ao excluir o usuário'})
        }
    } catch (error) {
        res.status(500).json({status: false, msg: 'Usuário não encontrado'})
    }

})


module.exports = router;