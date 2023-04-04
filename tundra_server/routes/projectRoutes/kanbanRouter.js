const Router = require('express')
const router = new Router()
const kanbanController = require('../../controllers/kanbanController')

router.get('/', kanbanController.getProject)

router.get('/:boardId', kanbanController.getProject)
router.post('/:boardId/newTask', kanbanController.createTask)
router.patch('/updateTask/:taskId', kanbanController.updateTask)
router.delete('/deleteTask/:taskId', kanbanController.deleteTask)
//router.use('/Scrumban', )

module.exports = router