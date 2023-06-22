const {DataTypes} = require("sequelize")
const sequelize = require("../helpers/bd")

const AdmModel = sequelize.define('Administradores', 
    {   
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: DataTypes.STRING,
        idade: DataTypes.INTEGER,
        cpf: DataTypes.STRING,
        usuario: DataTypes.STRING,
        senha: DataTypes.STRING
    }

)

module.exports = {
    list: async function(page, limit) {
        const offset = (page - 1) * limit; // Calcular o deslocamento (offset) com base na página e no limite
        const adm = await AdmModel.findAll({
            offset,
            limit,
        })
        return adm;
    },

    save: async function(nome, idade, cpf, usuario, senha){
        const adm = await AdmModel.create({
            nome: nome,
            idade: idade,
            cpf:cpf,
            usuario: usuario,
            senha: senha
        })
        return adm;
    },

    update: async function(id, obj){
        let adm = await AdmModel.findByPk(id)
        if(!adm) {
            return false
        }

        Object.keys(id).forEach(key => adm[key] = obh[key])
        await adm.save()
        return adm;
    },

    delete: async function(id) {
        const adm = await AdmModel.findByPk(id)
        return adm.destroy()
    },

    getById: async function(id) {
        return await AdmModel.findByPk(id);
    },

    consultaLogin: async function(usuario, senha) {
        try {
            const adms = await AdmModel.findAll({
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

    Model: AdmModel,
}


