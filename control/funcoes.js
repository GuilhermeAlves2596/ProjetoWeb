var express = require('express')
var jwt = require('jsonwebtoken');
const { token } = require('morgan');


module.exports = {
  validateToken(req, res, next) {
    let token_full = req.headers["authorization"];
    if (!token_full) token_full = "";

    jwt.verify(token_full, "#Abcdefg", (err, payload) => {
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

    validateAltUser(req, res, next) {
        const {user} = req.body
    
        if(!user){
            res
            .status(403)
            .json({ status: false, msg: "Digite o seu usuario" });
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
    }
};
