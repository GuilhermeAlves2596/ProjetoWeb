var express = require('express');
var router = express.Router();
const { token } = require('morgan');
var funcoes = require('../control/funcoes')
const alunosDAO = require('../model/alunos')
const instrutorDAO = require('../model/instrutores')

// Listar alunos cadastrados
router.get('/listAll', funcoes.validateToken, funcoes.limiteList, async (req, res) => {
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    let alunos = await alunosDAO.list(page, limit);
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

// Lógica de negócio - Calculo de IMC
router.get('/imc/:id', funcoes.validateToken, async (req, res) => {

    try {
        let aluno = await alunosDAO.getById(req.params.id)
        let idade = aluno.idade;
        let peso = aluno.peso;
        let altura = aluno.altura;
        let nome = aluno.nome
        const calculoIMC = parseFloat(funcoes.calculoIMC(peso,altura));
        let profissional;
        let profissional2;
        
        if(calculoIMC < 18.5){
            profissional = await instrutorDAO.getEspecialidade('Nutricionista');
            return res.json({status: true,nome, idade, altura, peso, seuIMC: calculoIMC, IMC:'Seu IMC é: '+calculoIMC+'Kg/m²', 
                                msg: 'Classificação MAGREZA, o aluno deve procurar um de nossos profissionais para definir uma dieta de ganho de peso', 
                                profissional})
        } else if(18.5 <= calculoIMC && calculoIMC < 24.9) {
            profissional = await instrutorDAO.getEspecialidade('Musculação');
            return res.json({status: true,nome, idade, altura, peso, IMC:'Seu IMC é: '+calculoIMC+'Kg/m²', 
                                msg: 'Classificação NORMAL, o aluno esta com seu peso normal, caso queira ganhar massa, aqui estão alguns de nossos profissionais especializados', 
                                profissional})        
        } else if(24.9 <= calculoIMC && calculoIMC <= 29.9){
            profissional = await instrutorDAO.getEspecialidade('Emagrecimento');
            return res.json({status: true,nome, idade, altura, peso, IMC:'Seu IMC é: '+calculoIMC+'Kg/m²', 
                                msg: 'Classificação SOBREPESO, atenção, o aluno está com seu peso acima do normal, deve procurar um profissional para definir rotinas de emagrecimento', 
                                profissional})          
        } else if(calculoIMC >= 30){
            profissional = await instrutorDAO.getEspecialidade('Emagrecimento');
            profissional2 = await instrutorDAO.getEspecialidade('Nutricionista');
            return res.json({status: true,nome, idade, altura, peso, IMC:'Seu IMC é: '+calculoIMC+'Kg/m²', 
                                msg: 'Classificação OBESIDADE GRAU I, muita atenção, o aluno esta com o peso muito acima do normal, deve procurar um profissional para definir rotinas de emagrecimento e um nutricionista', 
                                profissional, profissional2})          
        }        
    } catch (error) {
        return res.status(500).json({status: false, msg:'Aluno não encontrado'})        
    }

})

module.exports = router;