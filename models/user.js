const {Schema, model} = require('mongoose')
const { createHmac, randomBytes } = require('crypto');

const {createTokenForUser} = require('../services/authentication.js')


const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profileImgURL: {
        type: String,
        default: '/images/profileIMG.png'
    },
    salt: {
        type: String,
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, {timestamps: true})



userSchema.pre('save', function (next){
    const user = this;
    
    if(!user.isModified('password'))
        return;

    const privateKey = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', privateKey)
    .update(user.password)
    .digest('hex')

    this.salt = privateKey;
    this.password = hashedPassword;

    next();
})

userSchema.static('matchPasswordAndGenerateToken', async function(email, password){
    // find the user
    const user = await this.findOne({email})

    if(!user)
        throw new Error('user not found')

        // console.log('user : ',user)

    const privateKey = user.salt;
    // console.log('key: ', privateKey)
    const hashedPassword = user.password
    const hashedProvidedPassword = createHmac('sha256',privateKey)
    .update(password)
    .digest('hex')

    if(hashedPassword !== hashedProvidedPassword)
        throw new Error('incorrect password')

    const token = createTokenForUser(user);
    return token;
})


const User = model('user', userSchema);

module.exports = {User}