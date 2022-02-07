const Order =require('../../../model/order')

function statusController(){
    return {
        update:(req,res)=>{
            Order.updateOne({_id:req.body.orderId},{status:req.body.status},(err,data)=>{
                if(err){
                    return res.redirect('/adminOrders')
                }
                //Emit event
                const eventEmitter = req.app.get('eventEmitter') // see part9 at 1.50.00
                eventEmitter.emit('orderUpdated',{id:req.body.orderId,status:req.body.status})
                res.redirect('/adminOrders')
            })

        }
    }
}

module.exports = statusController