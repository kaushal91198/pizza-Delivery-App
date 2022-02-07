const order = require("../../../model/order")


// function orderController() {
//     return {
//         index(req, res) {
//            order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
//                if(req.xhr) {
//                    console.log(orders)
//                    return res.json(orders)
//                } else {
//                 return res.render('admin/orders')
//                }
//            })
//         }
//     }
// }

function orderController(){
    return {
        index:(req,res)=>{
            order.find({ status: { $ne: 'completed' } }).sort({ 'createdAt': -1 }).populate('customerId','-password').then((orders)=>{
                if(req.xhr){
                    return res.json(orders)
                } else {
                    return res.render('admin/orders')
                }
            }).catch(error=>console.log(error))
        }
    }
}``

module.exports = orderController