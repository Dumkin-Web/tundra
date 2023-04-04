const Router = require('express')
const router = new Router()

const kanbanRouter = require('./kanbanRouter')
const projectMiddleware = require('../../middleware/projectMiddleware')
const projectTypeMiddlewear = require('../../middleware/projectTypeMiddleware')
const projectController = require('../../controllers/projectController')

// router.use('/kanban', kanbanRouter)
// //router.use('/Scrum', userRouter)
// //router.use('/Scrumban', userRouter)
// router.get("/", (req, res) => {
//     res.status(200).json({message: `Your project is ${req.params.projectId}`})
// })

//PROJECT METHODS
router.post('/newProject', projectController.createProject)
router.get('/projectTypes', projectController.projectTypes)
router.get('/allProjects', projectController.getAllProjects)
router.get('/:projectId/members', projectController.getAllMembers)
router.get('/:projectId/messages', projectController.getAllMessages)
router.post('/:projectId/invite', projectController.inviteUser)
router.delete('/:projectId', projectController.deleteProject)


//Написать настройку проекта и сделать мидлвеар для проверки овнера
router.use('/:projectId/kanban', projectMiddleware, projectTypeMiddlewear("Kanban"), kanbanRouter)

module.exports = router