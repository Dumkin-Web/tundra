const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/signIn', userController.authorization)
router.post('/signUp', userController.registration)
router.get('/auth', authMiddleware, userController.check)
router.get('/getTasks', authMiddleware, userController.getTasks)
router.get('/getAllDialogs', authMiddleware, userController.getAllDialogs)
router.patch('/updateUser', authMiddleware, userController.updateUser)
router.get('/:userId', authMiddleware, userController.getUser)

module.exports = router