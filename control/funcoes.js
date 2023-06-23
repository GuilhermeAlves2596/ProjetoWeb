var jwt = require('jsonwebtoken');
const { token } = require('morgan');
var admDAO = require("../model/ADM");


module.exports = {
  isADM(req, res, next) {
    let token = req.headers.authorization;
    
    jwt.verify(token, process.env.DB_TOKEN, async (err, payload) => {
        try {
            let adm = await admDAO.consultaLogin(payload.user, payload.password)
            if(adm && adm != ''){
                next();
            } else {
            res.status(403)
            .json({ status: false, msg: "Acesso negado - Voce não possui acesso adm" });
            }
        } catch (error) {
            res.status(403)
            .json({ status: false, msg: "Acesso negado - Token invalido" });
        }

    });
  },

  validateToken(req, res, next) {
    let token_full = req.headers["authorization"];
    if (!token_full) token_full = "";

    jwt.verify(token_full, process.env.DB_TOKEN, (err, payload) => {
      if (err) {
        res
          .status(403)
          .json({ status: false, msg: "Acesso negado - Token invalido" });
        return;
      }
      req.user = payload.user;
      next();
    });
  },

  validateLogin(req, res, next) {
    const {user, password} = req.body

    if(!user || !password){
        res
        .status(403)
        .json({ status: false, msg: "Digite seu login e senha" });
        return;
    }
    next();
  },

// Verificar se o limite está entre os valores permitidos
  limiteList(req, res, next){
    let limit = parseInt(req.query.limit);

    if (limit !== 5 && limit !== 10 && limit !== 30) {
        res.status(403).json({ status: false, msg: 'O limite de usuarios por pagina deve ser 5,10 ou 30. Ex:/listAll?page=2&limit=5'});
        return;
    }
    next();
  },

// Funções ADM
    validateADM(req, res, next) {
        const { nome, idade, cpf, usuario, senha } = req.body

        if (!nome || !idade || !cpf || !usuario || !senha) {
            res
            .status(403)
            .json({ status: false, msg: "Todos os campos devem ser preenchidos" });
            return;
        }
        next();
    },
// Funções usuarios
    validateUsuario(req, res, next) {
        const { nome, idade, cpf, cidade, usuario, senha } = req.body

        if (!nome || !idade || !cpf || !cidade || !usuario || !senha) {
            res
            .status(403)
            .json({ status: false, msg: "Todos os campos devem ser preenchidos" });
            return;
        }
        next();
    },
// Funções alunos
    validateAluno(req, res, next) {
        const {nome, idade, genero, endereco, altura, peso} = req.body

        if(!nome || !idade || !genero || !endereco || !altura || !peso) {
            res
            .status(403)
            .json({ status: false, msg: "Todos os campos devem ser preenchidos" });
            return;            
        }
        next();
    },
// Funções instrutores
    validateInstrutor(req, res, next) {
        const {nome, idade, genero, endereco, formado, salario, especialidade} = req.body

        if(!nome || !idade || !genero || !endereco || !formado || !salario || !especialidade){
            res
            .status(403)
            .json({ status: false, msg: "Todos os campos devem ser preenchidos" });
            return; 
        }
        next();
    },
// Funções aulas
    validateAula(req, res, next) {
        const {data, horario, nome} = req.body

        if(!data || !horario || !nome){
            res
            .status(403)
            .json({ status: false, msg: "Todos os campos devem ser preenchidos" });
            return;  
        }
        next();
    },
// Função calculo IMC
    calculoIMC(peso, altura){
        var alturaEmMetro = altura / 100;
        const imc = peso / (alturaEmMetro * alturaEmMetro)

        return imc.toFixed(1);
    }
};
