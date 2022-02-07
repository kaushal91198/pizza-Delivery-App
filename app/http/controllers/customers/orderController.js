const Order =require('../../../model/order')
const moment = require('moment')
const mongoose  = require('mongoose')
function orderController(){
    return {
        store:(req,res)=>
        {
            const {phone,address} = req.body
            if(!phone || !address){
                req.flash('error','All fields are required')
                return redirect('/cart')
            }
            const order = new Order({
                customerId:req.user._id,
                items:req.session.cart.items,
                phone:req.body.phone,
                address:req.body.address
            })
            order.save().then(result=>{
                Order.populate(result,{path:'customerId'},(err,placedOrder)=>{
                    req.flash('success','Order placed successfully')
                    // emit
                    const eventEmitter = req.app.get('eventEmitter') // see part9 at 1.50.00
                    eventEmitter.emit('orderPlaced',result)
                     delete req.session.cart
                    return res.redirect('/orders')        
                })
                
            }).catch(err=>{
                req.flash('error','Something went wrong')
                return res.redirect('/cart')
             })
        },
        index : async (req,res)=>{
            const orders = await Order.find({ customerId: req.user._id },
                null,
                {sort:{'createdAt':-1} // data is coming from database in descending order
            })
            return res.render('customers/orders',{orders:orders,moment:moment})
        },
        show: (req, res)=> {
            const id = req.params.id;
            Order.findOne({_id:id}).then((orders)=>{
            if(req.user._id.toString() === orders.customerId.toString()) {
                return res.render('customers/singleOrder', { order:orders })
            }
            return  res.redirect('/')
            }).catch(err=>console.log(err))
            
        }
    }
}

module.exports = orderController