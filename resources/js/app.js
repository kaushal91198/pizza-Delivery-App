import axios from "axios"
import Noty from "noty";
import { initAdmin } from './admin'
import moment from 'moment'



let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(tag) {
    axios.post('/updated_cart', tag).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            timeout: 1000,
            type: "success",
            text: "Item added to cart",
            progressBar: false,
            // layout:'topLeft'
        }).show();
    }).catch(err => {
        new Noty({
            timeout: 1000,
            type: "error",
            text: "Something went wrong",
            progressBar: false,
            // layout:'topLeft'
        }).show();
    })
}



// console.log(addToCart) // array of addtocartclass element
addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza) //see data-pizza in button video(Part-6,1.35.48)
        updateCart(pizza)

    })
})


// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}


let statuses = document.querySelectorAll('.status_line')
let order = document.querySelector('#hiddenInput') ? document.querySelector('#hiddenInput').value : null
// console.log(order)
order = JSON.parse(order)
let time = document.createElement('small')

//Change order status
function updateStatus(order) {
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true
    statuses.forEach((status) => {
        let dataProp = status.dataset.status// it give the dataset value
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })

}

updateStatus(order)

//socket

let socket = io("http://localhost:3000")

if (order) {
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')){
    initAdmin(socket)
    socket.emit('join','adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})
