const Router = require('express')
const scrumController = require('../../controllers/scrumController')
const router = new Router()

router.get('/', scrumController.getProject)

router.post('/newTask', scrumController.createTask)
router.patch('/moveTasks', scrumController.moveTasks)
router.patch('/:taskId', scrumController.updateTask)
router.delete('/:taskId', scrumController.deleteTask)

router.post('/createSprint', scrumController.createSprint)

module.exports = router