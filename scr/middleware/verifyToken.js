var jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        var token = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(token, process.env.VERIFY_TOKEN);
        req.fromId = decoded.fromId
        next()
    } catch (error) {
        res.json({
            status: false,
            mes:"Token đã hết hạn"
        })
    }
}

module.exports = verifyToken