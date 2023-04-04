const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const projectRouter = require('./projectRoutes/index')
const authMiddleware = require('../middleware/authMiddleware')

router.use('/user', userRouter)
router.use('/project', authMiddleware, projectRouter)

module.exports = router