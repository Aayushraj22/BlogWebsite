const JWT = require('jsonwebtoken')

const privateKey = "ayushJWT@bl0gWebsite001"

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        profileImgURL: user.profileImgURL,
    }

    const token = JWT.sign(payload, privateKey);
    return token;
}

function validateToken(token) {
    const user = JWT.verify(token, privateKey)
    return user;
}

module.exports = {
    createTokenForUser,
    validateToken,
}