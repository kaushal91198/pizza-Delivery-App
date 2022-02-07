const express = require('express')
const app = express.Router()

//routes
app.use(express.static('public'));

const orderController = require('../app/http/controllers/customers/orderController')

//middlewares
const auth = require('../app/http/middlewares/auth')

    app.get('/',auth,orderController().index)
    app.post('/',auth,orderController().store)
    app.get('/:id',orderController().show)

   

module.exports = app
