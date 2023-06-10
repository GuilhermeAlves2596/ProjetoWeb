const express = require('express')
const router = express.Router()
const sequelize = require('../helpers/bd')

const ADMModel = require('../model/ADM')

router.get('/', async (req, res) => {
    await sequelize.sync({force: true})

    let adm1 = await ADMModel.save('Guilherme', 26, 'Alves', '2596')
    
    res.json({status: true, adm1: adm1})
})

module.exports = router