const {DataTypes} = require("sequelize")
const sequelize = require("../helpers/bd")

const alunoModel = sequelize.define('Alunos', 
    {   
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: DataTypes.STRING,
        idade: DataTypes.INTEGER,
        genero: DataTypes.STRING,
        endereco: DataTypes.STRING,
        altura: DataTypes.DOUBLE,
        peso: DataTypes.DOUBLE
    }

)

module.exports = {
    list: async function(page, limit) {
        const offset = (page - 1) * limit; // Calcular o deslocamento (offset) com base na página e no limite
        const aluno = await alunoModel.findAll({
            offset,
            limit,
        })
        return aluno;
    },

    save: async function(nome, idade, genero, endereco, altura, peso){
        const aluno = await alunoModel.create({
            nome: nome,
            idade: idade,
            genero: genero,
            endereco: endereco,
            altura: altura,
            peso: peso
        })
        return aluno;
    },

    update: async function(id, nome, idade, genero, endereco, altura, peso) {
        return await alunoModel.update({nome: nome, idade: idade, genero: genero, endereco: endereco, altura: altura, peso: peso}, {
            where: { id: id }
        })
    },

    delete: async function(id) {
        const aluno = await alunoModel.findByPk(id)
        return aluno.destroy()
    },

    getById: async function(id) {
        return await alunoModel.findByPk(id);
    },

    Model: alunoModel
}
