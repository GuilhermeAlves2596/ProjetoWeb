const {DataTypes, Op} = require("sequelize")
const sequelize = require("../helpers/bd")

const instrutorModel = sequelize.define('Intrutores', 
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
        formado: DataTypes.BOOLEAN,
        salario: DataTypes.DOUBLE,
        especialidade: DataTypes.STRING
    }

)

module.exports = {
    list: async function(page, limit) {
        const offset = (page - 1) * limit; // Calcular o deslocamento (offset) com base na página e no limite
        const instrutor = await instrutorModel.findAll({
            offset, 
            limit,
        })
        return instrutor;
    },

    listUser: async function(page, limit) {
        const offset = (page - 1) * limit; // Calcular o deslocamento (offset) com base na página e no limite
        const instrutor = await instrutorModel.findAll({
            attributes: { exclude: ['salario'] }, // Excluir o campo "salario" para consultas por usuarios comuns
            offset,
            limit,
        })
        return instrutor;
    },

    save: async function(nome, idade, genero, endereco, formado, salario, especialidade){
        const instrutor = await instrutorModel.create({
            nome: nome,
            idade: idade,
            genero: genero,
            endereco: endereco,
            formado: formado,
            salario: salario,
            especialidade: especialidade
        })
        return instrutor;
    },

    update: async function(id, nome, idade, genero, endereco, formado, salario, especialidade) {
        return await instrutorModel.update({nome: nome, idade: idade, genero: genero, endereco: endereco, formado: formado, salario: salario, especialidade: especialidade}, {
            where: { id: id }
        })
    },

    delete: async function(id) {
        const instrutor = await instrutorModel.findByPk(id)
        return instrutor.destroy()
    },

    getById: async function(id) {
        return await instrutorModel.findByPk(id);
    },

    getById_User: async function(id) {
        return await instrutorModel.findByPk(id, {
            attributes: { exclude: ['salario'] }, // Excluir o campo "salario" para consultas por usuarios comuns
        });
    },

    getByName: async function(nome) {
        return await instrutorModel.findOne({where: {nome: {
            [Op.like]: '%' + nome + '%'
        } }})
    },

    getEspecialidade: async function(especialidade) {
        return await instrutorModel.findAll({where: {especialidade: {
            [Op.like]: '%' + especialidade + '%'
        } },
        attributes: { exclude: ['salario', 'endereco', 'idade', 'genero','updatedAt','createdAt'] }
        })
    },
    
    Model: instrutorModel
}
