const {DataTypes} = require("sequelize")
const sequelize = require('../helpers/bd')
const instrutor = require('./instrutores')

const aulaModel = sequelize.define('Aulas', 
    {   
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        data: DataTypes.STRING,
        horario: DataTypes.STRING
    }

)

aulaModel.belongsTo(instrutor.Model, {
    foreignKey: 'nome',
    as: 'instrutor'
})
instrutor.Model.hasMany(aulaModel, {foreignKey: 'nome'})


module.exports = {
    list: async function(page, limit) {
        const offset = (page - 1) * limit; // Calcular o deslocamento (offset) com base na página e no limite
        const aula = await aulaModel.findAll({ 
            include: [
                {
                    model: instrutor.Model,
                    attributes: ['nome', 'especialidade'],
                    as: 'instrutor' // Renomear para "instrutor"
                }
            ],
            attributes: { exclude: ['nome'] }, // Excluir o campo "nome"
            offset,
            limit, 
        });

        return aula;
    },

    save: async function(data, horario, nome){
        if(nome instanceof instrutor.Model) {
            nome = nome.id
        } else if (typeof nome === 'string') {
            obj = await instrutor.getByName(nome)
            console.log(obj)
            if(!obj) {
                return null
            }
            nome = obj.id
        }
        const aula = await aulaModel.create({
            data: data,
            horario: horario,
            nome: nome
        })
        return aula;
    },

    update: async function(id, data, horario, nome) {
        return await aulaModel.update({data: data, horario: horario, nome: nome}, {
            where: {id: id}
        })
    },

    delete: async function(id) {
        const aula = await aulaModel.findByPk(id)
        return aula.destroy()
    },

    getById: async function(id) {
        const aula = await aulaModel.findByPk(id, ({ 
            include: [
                {
                    model: instrutor.Model,
                    attributes: ['nome'],
                    as: 'instrutor' // Renomear para "instrutor"
                }
            ],
            attributes: { exclude: ['nome'] }, // Excluir o campo "nome"
        }));

        return aula;
    },

    Model: aulaModel
}
