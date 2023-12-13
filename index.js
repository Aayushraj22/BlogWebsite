require('dotenv').config()

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cookieparser = require('cookie-parser')
const {Blog} = require('./models/blog.js')


const userRouter = require('./routes/user.js')
const blogRouter = require('./routes/blog.js')
const {checkForAuthenticationCookie} = require('./middlewares/auth.js')

const app = express()

mongoose.connect(process.env.URI)
.then(()=>console.log('mongodb started'))
.catch((error) => console.log('db not connected'))

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieparser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))

app.use('/user', userRouter)
app.use('/blog', blogRouter)



app.get('/', async(req,res) => {
    const allBlog = await Blog.find({});

    res.render('home',{
        user: req.user,
        allBlog,
    })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>console.log(`server started at port : ${PORT}`))