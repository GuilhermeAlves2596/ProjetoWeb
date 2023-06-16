const {DataTypes} = require("sequelize")
const sequelize = require("../helpers/bd")

const userModel = sequelize.define('Usuarios', 
    {   
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: DataTypes.STRING,
        idade: DataTypes.INTEGER,
        cpf: DataTypes.STRING,
        cidade: DataTypes.STRING,
        usuario: DataTypes.STRING,
        senha: DataTypes.STRING
    }

)

module.exports = {
    list: async function() {
        const user = await userModel.findAll()
        return user;
    },

    save: async function(nome, idade, cpf, cidade, usuario, senha){
        const user = await userModel.create({
            nome: nome,
            idade: idade,
            cpf: cpf,
            cidade: cidade,
            usuario: usuario,
            senha: senha
        })
        return user;
    },

    update: async function(id, nome, idade, cpf, cidade, usuario, senha) {
        return await userModel.update({nome: nome, idade: idade, cpf: cpf, cidade: cidade, usuario: usuario, senha: senha}, {
            where: { id: id }
        })
    },

    delete: async function(id) {
        const user = await userModel.findByPk(id)
        return user.destroy()
    },

    getById: async function(id) {
        return await userModel.findByPk(id);
    },

    consultaLogin: async function(usuario, senha) {
        try {
            const adms = await userModel.findAll({
                where: {
                usuario: usuario,
                senha: senha
                }
            });
            return adms;
        } catch (error) {
          console.error('Usuario não encontrado', error);
          throw error;
        }
    },

    Model: userModel,
}


