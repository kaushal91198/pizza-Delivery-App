const Menu = require('../../model/menu')
console.log()


function homeController(){

    return{
        async index(req,res){
            const pizzas = await Menu.find()
            // console.log(pizzas)
            return res.render('home',{pizzas: pizzas})
            //By then method
            // Menu.find({}).then((data)=>{
            //     return res.render('home')
            // }).catch(err=>{
            //     return res.render('home')
            // })
        }
        //it is same as index:async function(){res.render("home")}

    }
}
module.exports =  homeController