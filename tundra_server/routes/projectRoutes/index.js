const Router = require('express')
const router = new Router()

const kanbanRouter = require('./kanbanRouter')
const scrumRouter = require('./scrumRouter')
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
router.get('/:projectId', projectMiddleware, projectController.getProjectData)
router.get('/:projectId/members', projectMiddleware, projectController.getAllMembers)
router.get('/:projectId/messages', projectMiddleware, projectController.getAllMessages)
router.post('/:projectId/invite', projectMiddleware, projectController.inviteUser)
router.delete('/:projectId', projectMiddleware, projectController.deleteProject)
router.post('/:projectId/leaveFromProject', projectController.leaveFromProject)


//Написать настройку проекта и сделать мидлвеар для проверки овнера
router.use('/:projectId/kanban', projectMiddleware, projectTypeMiddlewear("Kanban"), kanbanRouter)
router.use('/:projectId/scrum', projectMiddleware, projectTypeMiddlewear("Scrum"), scrumRouter)

module.exports = router