const User =require('../../model/user')
const bcrypt = require('bcrypt')
const passport = require('passport')





function authController(){
const _getRedirectUrl=(req)=>{
    return req.user.role==='admin'? '/adminOrders': '/'
}



    return{
       login:(req,res)=>{
        res.render('auth/login') 
    },
    postLogin(req, res, next) {
        const { email, password }   = req.body
       // Validate request 
        if(!email || !password) {
            req.flash('error', 'All fields are required')
            return res.redirect('/login')
        }
        passport.authenticate('local',/*because we use local-passport module*/ (err, user, info) => {
            // here we are defining the  done function
            if(err) {
                req.flash('error', info.message )
                return next(err)
            }
            if(!user) {
                req.flash('error', info.message )
                return res.redirect('/login')
            }
            //calling the login inbuilt function
            req.logIn(user, (err) => {

                if(err) {
                    req.flash('error', info.message ) 
                    return next(err)
                }

                return res.redirect(_getRedirectUrl(req))
            })
        })(req, res, next) //see video part 7  at 1.08.00 hour 
        //passport.authenticate return one function we have to call that function at end of the function
    },
    register:(req,res)=>{
        res.render('auth/register')
    },
    postRegister: async (req,res)=>{
        const { name,email,password } = req.body
        //console.log(req.body)
        //validate request
        if(!name || !email || !password){
            req.flash('error','All fields are required')
            req.flash('name',name)
            req.flash('email',email)
            return res.render('auth/register')
        }
        User.exists({email:email},(err,result)=>{
            if(result){
                req.flash('error','Email already taken')
                return res.render('auth/register')
            }
        })
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({
               name:name,
               email:email,
               password:hashedPassword
        })
        user.save().then((user)=>{
            //redirect to home page
            return res.redirect('/')
        }).catch(err=>{
            req.flash('error','Something went wrong')
            return res.redirect('/register')
        })
        
    },
    logout:(req,res)=>{
        req.logout()
        return res.redirect('/login')
    }
    }
} 
module.exports =  authController
