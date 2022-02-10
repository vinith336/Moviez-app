const jwt = require('jsonwebtoken')

const User = require('../models/user')

const auth = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.redirect('/')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    if (!user) {
        return res.render('login', {
            title: 'MovieZ',
            toastMessage: req.query.toastMessage
        })
    }
    req.user = user
    req.token = token
    next()
}

module.exports = auth