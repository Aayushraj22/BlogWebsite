const express = require('express')

const {User} = require('../models/user.js');
const { createTokenForUser } = require('../services/authentication.js');
const router = express();

router
.route('/signup')
.get(async(req,res) => {
    return res.render('signup')
})
.post( async (req,res) => {
    // console.log('req.body: ',req.body)
    const {fullname, email, password} = req.body;

    if(!fullname || !email || !password)
        return res.render('signup')

    let user = await User.findOne({email})
    // console.log('user for database: ',user)

    // if user-email already in database then return to signup page and msg:- (use other email) 
    if(user)
        return res.render('signup')

    // console.log('user : ',user)
    user = User.create({
        fullname,
        email,
        password
    })

    return res.cookie('token', ).redirect('/')
})


router
.route('/signin')
.get( async (rq,res) => {
    res.render('signin')
})
.post(async (req,res) => {
    const {email, password} = req.body;

    try {
        const token = await User.matchPasswordAndGenerateToken(email,password)
        return res.cookie('token', token).redirect('/')

    } catch (error) {
        return res.render('signin', {error: 'incorrect Email or Password'})
    }

})

router.route('/logout')
.get(async (req,res) => {
    return res.clearCookie('token').redirect('/')
})

module.exports = router
