require('dotenv').config()
const express = require('express')
const app = express();
const path =  require("path")
const PORT = process.env.PORT || 3000
const expressLayout = require("express-ejs-layouts")
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session');
const MongoStore = require('connect-mongo')
const passport = require('passport')
const Emitter = require('events')

//Database Connection
const url = 'mongodb://localhost/pizza';
mongoose.connect(url, /*{ useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true }*/);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).on('error',(err) => {
    console.log('Connection failed...')
});

//session config 
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoStore.create({ mongoUrl: url }),
    saveUninitialized: true,
    cookie:{maxAge:1000 * 60 * 60 * 24} //24 hours //it will expire in 24 hours
  }))

// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())
//Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }  ))
app.use(express.json())

//Global middleware
app.use((req,res,next)=>{
res.locals.session=req.session
res.locals.user = req.user //see part-6 at 2.04.53
next()
})

//Ejs template engines
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine','ejs')



//import the route function
const routes = require("./routes/user")
const orders = require("./routes/order")
app.use('/',routes)
app.use('/orders',orders)


// const mix = require('laravel-mix');
// mix.js('resources/js/app.js', 'public/js/app.js').sass('resources/scss/app.scss', 'resources/css/app.css');

const server=app.listen( 3000, function() {
    console.log(`Listening on port 3000`)
})

//event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)

// Socket
const io = require('socket.io')(server)
io.on('connection', function(socket) {
    // Join 
    socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})