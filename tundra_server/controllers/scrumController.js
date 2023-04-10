const {Project, Scrum, ScrumTask} = require('../models/models')
const ApiError = require('../errors/ApiError')
const { where, Op } = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const tgBot = require('../tgBot/index')
const { Format } = require('telegraf')

class ScrumController{

    async createScrum(req, res, next){
        const {projectId} = req.body;

        try{
            const newScrum = await Scrum.create({name: 'Backlog', projectId})

            res.status(201).json({message: "New project created"})
        }catch(e){
            console.log(e);
            return next(e)
        }
    }

    // TASK //
    async createTask(req, res, next){
        const projectId = req.projectId
        const {name, description = '', storyPoints = 0} = req.body
        try{
            const scrumProject = await Scrum.findOne({where: {projectId}})

            const newTask = await ScrumTask.create({ name, description, storyPoints, scrumId: scrumProject.id})

            const botMessage = `New task ${newTask.name} has been created! \n\nYou can view the changes by following the link: \nhttps://tundra-workspace.ru/project/${req.projectId}`     
            tgBot.sendNotification(projectId, botMessage)
        }
        catch(e){
            console.log(e);
            return next(e)
        }

        return res.status(201).json({message: "Task created"})
    }

    async updateTask(req, res, next){
        const id = req.params.taskId

        const newTaskData = req.body
        try{
            const task = await ScrumTask.findOne({where: {id}})
            Object.keys(newTaskData).forEach((key) => {
                if(task[key] !== undefined){
                    task[key] = newTaskData[key]
                }
            })

            const botMessage = `Task ${task.name} has been updated! \n\nYou can view the changes by following the link: \nhttps://tundra-workspace.ru/project/${req.projectId}`        
            tgBot.sendNotification(req.projectId, botMessage)

            task.save()
        }
        catch(e){
            console.log(e);
            return next(e)
        }

        return res.status(200).json({message: 'Task updated'})
    }

    async moveTasks(req, res, next){

        const {tasksId, scrumId} = req.body

        try{
            const taskList = await ScrumTask.findAll({
                where: {
                    [Op.or]: tasksId
                },
            })

            taskList.forEach((task) => {
                task.scrumId = scrumId
                task.save()
            })

        }
        catch(e){
            console.log(e);
            return next(e)
        }

        return res.status(200).json({message: 'Task updated'})
    }

    async deleteTask(req, res, next){
        const id = req.params.taskId

        try{
            const task = await ScrumTask.destroy({where: {id}})
        }
        catch(e){
            console.log(e);
            return next(e)
        }

        return res.status(200).json({message: 'Task deleted'})
    }

    // SPRINT //

    async createSprint(req, res, next){
        const projectId = req.projectId
        const {name, sprintEnd, sprintStart} = req.body
        try{
            const mainScrum = await Scrum.findOne({where: {projectId}})

            if(!mainScrum){
                return next(ApiError.badRequest('Project id expected'))
            }

            const newSprint = await Scrum.create({name, scrumId: mainScrum.id, sprintEnd, sprintStart})

            const botMessage = `New sprint ${newSprint.name} has been created! \n\nYou can view the changes by following the link: \nhttps://tundra-workspace.ru/project/${req.projectId}`        
            tgBot.sendNotification(req.projectId, botMessage)

            return res.status(201).json({message: "Sprint created", scrumId: newSprint.id})
        }
        catch(e){
            console.log(e);
            return next(e)
        }
    }

    async updateSprint(req, res, next){ //NEED TO REMAKE
        const id = req.params.boardId

        const newBoardData = req.body
        try{
            const board = await KanbanBoard.findOne({where: {id}})
            Object.keys(newBoardData).forEach((key) => {
                if(board[key] != undefined){
                    board[key] = newBoardData[key]
                }
            })

            board.save()
        }
        catch(e){
            console.log(e);
            return next(e)
        }

        return res.status(200).json({message: 'Board updated'})
    }

    async deleteSprint(req, res, next){ //NEED TO REMAKE
        const id = req.params.boardId

        try{
            const board = await KanbanBoard.destroy({where: {id}})

        }
        catch(e){
            console.log(e);
            return next(e)
        }

        return res.status(200).json({message: 'Board deleted'})
    }

    async getProject(req, res, next){
        const id = req.projectId;

        try{
            if(!id){
                return res.status(400).json({message: "Bad request, no project id parametr"})
            }
            const project = await Project.findOne({
                include: [
                    {
                        model: Scrum,
                        required: false,
                        include: [
                            {
                                model: ScrumTask,
                                required: false
                            }
                        ]
                    }
                ],
                where: {id}
            })

            let sprints = await Scrum.findAll({
                where: {scrumId: project.scrum.id},
                include: [{
                    model: ScrumTask,
                    required: true
                }]
            })

            project.dataValues.sprints = sprints
            
            return res.status(200).json(project)

        }catch(e){
            console.log(e);
            return next(e)
        }
    }
}

module.exports = new ScrumController()