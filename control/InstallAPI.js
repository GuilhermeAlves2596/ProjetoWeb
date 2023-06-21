const express = require('express')
const router = express.Router()
const sequelize = require('../helpers/bd')

const ADMModel = require('../model/ADM')
const usuarioModel = require('../model/usuarios')
const alunoModel = require('../model/alunos')
const intrutorModel = require('../model/instrutores')
const aulaModel = require('../model/aulas')

router.get('/', async (req, res) => {
    await sequelize.sync({force: true})

    // Popular tabela ADM
    let adm1 = await ADMModel.save('Guilherme', 26, '068.400.089-08','Alves', '2596')

    // Popular tabela usuarios
    let user1 = await usuarioModel.save('Joaquim',23,'111.111.111-11','Londrina','joaquim','joaquim')
    let user2 = await usuarioModel.save('Mariana', 30, '222.222.222-22', 'São Paulo', 'mariana', 'mariana');
    let user3 = await usuarioModel.save('Carlos', 28, '333.333.333-33', 'Rio de Janeiro', 'carlos', 'carlos');
    let user4 = await usuarioModel.save('Amanda', 25, '444.444.444-44', 'Porto Alegre', 'amanda', 'amanda');
    let user5 = await usuarioModel.save('Ricardo', 32, '555.555.555-55', 'Brasília', 'ricardo', 'ricardo');
    let user6 = await usuarioModel.save('Patrícia', 27, '666.666.666-66', 'Salvador', 'patricia', 'patricia');
    let user7 = await usuarioModel.save('Fernando', 29, '777.777.777-77', 'Recife', 'fernando', 'fernando');
    let user8 = await usuarioModel.save('Camila', 26, '888.888.888-88', 'Belo Horizonte', 'camila', 'camila');
    let user9 = await usuarioModel.save('Diego', 24, '999.999.999-99', 'Curitiba', 'diego', 'diego');
    let user10 = await usuarioModel.save('Isabel', 31, '000.000.000-00', 'Fortaleza', 'isabel', 'isabel');

    let usuarios = [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10]
    
    // Popular tabela Alunos
    let aluno1 = await alunoModel.save('Pedro', 20, 'Masculino', 'Rua Sem Saida', 190, 90);
    let aluno2 = await alunoModel.save('Bia', 35, 'Feminino', 'Rua Com Saida', 160, 55);
    let aluno3 = await alunoModel.save('Maria', 18, 'Feminino', 'Avenida Principal', 170, 60);
    let aluno4 = await alunoModel.save('João', 22, 'Masculino', 'Rua das Flores', 180, 75);
    let aluno5 = await alunoModel.save('Ana', 19, 'Feminino', 'Rua dos Sonhos', 165, 55);
    let aluno6 = await alunoModel.save('Luiz', 21, 'Masculino', 'Avenida Central', 175, 70);
    let aluno7 = await alunoModel.save('Carla', 20, 'Feminino', 'Rua dos Passarinhos', 160, 50);
    let aluno8 = await alunoModel.save('Miguel', 23, 'Masculino', 'Avenida das Palmeiras', 185, 80);
    let aluno9 = await alunoModel.save('Isabela', 19, 'Feminino', 'Rua dos Amores', 175, 65);
    let aluno10 = await alunoModel.save('Gabriel', 22, 'Masculino', 'Avenida dos Esportes', 180, 75);

    let alunos = [aluno1, aluno2, aluno3, aluno4, aluno5, aluno6, aluno7, aluno8, aluno9, aluno10]

    // Popular tabela Instrutores
    let instrutor1 = await intrutorModel.save('Joao', 40, 'Masculino', 'AV XV de novembro', true, 3500,"Musculação")
    let instrutor2 = await intrutorModel.save('Jose', 45, 'Masculino', 'Rua Cambara', false, 2300, "Fisioterapia")
    let instrutor3 = await intrutorModel.save('Maria', 25, 'Feminino', 'Rua Sem Saida', true, 2500, "Pilates")
    let instrutor4 = await intrutorModel.save('Pedro', 30, 'Masculino', 'Rua Com Saida', true, 3000, "Fortalecimento")
    let instrutor5 = await intrutorModel.save('Joana', 28, 'Feminino', 'Rua das Alamedas', false, 2000, "Emagrecimento")

    let instrutores = [instrutor1, instrutor2, instrutor3, instrutor4, instrutor5]

    // Popular tabela aulas
    let aula1 = await aulaModel.save('17/07/2023','08:00',instrutores[0].id)
    let aula2 = await aulaModel.save('25/07/2023','09:00',instrutores[1].id)
    let aula3 = await aulaModel.save('26/07/2023','10:00',instrutores[2].id)
    let aula4 = await aulaModel.save('27/07/2023','13:00',instrutores[3].id)
    let aula5 = await aulaModel.save('28/07/2023','11:00',instrutores[4].id)
    let aula6 = await aulaModel.save('29/07/2023','20:00',instrutores[0].id)
    let aula7 = await aulaModel.save('30/07/2023','19:00',instrutores[1].id)
    let aula8 = await aulaModel.save('31/07/2023','17:00',instrutores[2].id)
    let aula9 = await aulaModel.save('01/07/2023','15:00',instrutores[3].id)
    let aula10 = await aulaModel.save('02/07/2023','14:00',instrutores[4].id)

    const lista_aulas = [aula1, aula2, aula3, aula4, aula5, aula6, aula7, aula8, aula9, aula10 ];


    res.json({status: true, msg: 'Tabelas criadas com sucesso', 
                            adm1: adm1,
                            usuarios: usuarios,
                            alunos: alunos,
                            instrutores: instrutores,
                            lista_aulas: lista_aulas})
})

module.exports = router