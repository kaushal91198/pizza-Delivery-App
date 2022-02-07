const express = require('express')
const app = express.Router()
app.use(express.static('public'));
//routes
const authController = require('../app/http/controllers/authController')
const homeController = require('../app/http/controllers/homeController')
const cartController = require('../app/http/controllers/customers/cartController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')


//middlewares
const guest = require('../app/http/middlewares/guest')
const admin = require('../app/http/middlewares/admin')

    app.get("/",homeController().index)

    app.get("/login",guest,authController().login)
    app.post("/login",authController().postLogin)

    app.post('/logout',authController().logout)

    app.get("/register",guest,authController().register) 
    app.post('/register',authController().postRegister)

    app.get("/cart",cartController().cart)
    app.post('/updated_cart',cartController().update)

    //admin routes
    app.get('/adminOrders',admin,adminOrderController().index)

    //admin/order/status
    app.post('/adminOrderStatus',admin,statusController().update)



module.exports = app
// function initRoutes(app){
//     app.get("/",homeController().index)

//     app.get("/login",guest,authController().login)
//     app.post("/login",authController().postLogin)

//     app.post('/logout',authController().logout)

//     app.get("/register",guest,authController().register) 
//     app.post('/register',authController().postRegister)

//     app.get("/cart",cartController().cart)
//     app.post('/updated_cart',cartController().update)

//     //customer routes
//     app.get('/orders',auth,orderController().index)
//     app.post('/orders',auth,orderController().store)
//     app.get('/:id',orderController().show)

//     //admin routes
//     app.get('/adminOrders',admin,adminOrderController().index)

//     //admin/order/status
//     app.post('/adminOrderStatus',admin,statusController().update)

// }
// module.exports = initRoutes