const usersRouter = require('./user')
const testRouter = require('./testrouter');
const accountRouter = require('./account')
const verifyToken = require('../middleware/verifyToken')

function route(app) {
    
    app.use('/user', verifyToken, usersRouter);
    
    app.use('/test',testRouter);
    
    app.use('/',accountRouter);
}

module.exports = route