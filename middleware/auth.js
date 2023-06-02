require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (token) {
            token = token.split(" ")[1]
            let user = jwt.verify(token, SECRET_KEY)
            req.userId = user.id
        } else {
            return res.status(400).json({ message: "unauthorized user" })
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "unauthorized user" })
    }
    next()
}
module.exports = auth