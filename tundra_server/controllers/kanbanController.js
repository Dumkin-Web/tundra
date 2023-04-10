const {Project, KanbanBoard, KanbanColumn, KanbanTask} = require('../models/models')
const ApiError = require('../errors/ApiError')
const { where } = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const tgBot = require('../tgBot/index')
const { Format } = require('telegraf')

class KanbanController{

    async createKanban(req, res, next){
        const {projectName, projectId} = req.body;

        try{
            const project = await Project.findOne({where: {id: projectId}})
            const newKanban = await KanbanBoard.create({name: projectName, projectId})
            const todoColumn = await KanbanColumn.create({name: "TODO", color: "#ff6d3b", kanbanBoardId: newKanban.id, order: 0})
            const inWorkColumn = await KanbanColumn.create({name: "IN WORK", color: "#fff72b", kanbanBoardId: newKanban.id, order: 1})
            const doneColumn = await KanbanColumn.create({name: "DONE", color: "#5fff2b", kanbanBoardId: newKanban.id, order: 2})

            res.status(201).json({message: "New project created"})
        }catch(e){
            console.log(e);
            return next(e)
        }
    }

    // TASK //
    async createTask(req, res, next){
        const {kanbanColumnId, name, description, order, deadline, executorId, inWork} = req.body
        try{
            const newTask = await KanbanTask.create({kanbanColumnId, name, description, order, deadline, executorId: executorId ?? -1, inWork })

            const botMessage = `New task ${newTask.name} has been created! \n\nYou can view the changes by following the link: \nhttps://tundra-workspace.ru/project/${req.projectId}`     
            tgBot.sendNotification(req.projectId, botMessage)
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
            const task = await KanbanTask.findOne({where: {id}})
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

    async deleteTask(req, res, next){
        const id = req.params.taskId

        try{
            const task = await KanbanTask.destroy({where: {id}})
        }
        catch(e){
            console.log(e);
            return next(e)
        }

        return res.status(200).json({message: 'Task deleted'})
    }

    // BOARD //

    async createBoard(req, res, next){
        const projectId = req.projectId

        try{
            const project = await Project.findOne({where: {id: projectId}})

            if(!project){
                return next(ApiError.badRequest('Project id expected'))
            }

            const newBoard = await KanbanBoard.create({name: project.name, projectId})
            const todoColumn = await KanbanColumn.create({name: "TODO", color: "#ff6d3b", kanbanBoardId: newBoard.id, order: 0})
            const inWorkColumn = await KanbanColumn.create({name: "IN WORK", color: "#fff72b", kanbanBoardId: newBoard.id, order: 1})
            const doneColumn = await KanbanColumn.create({name: "DONE", color: "#5fff2b", kanbanBoardId: newBoard.id, order: 2})

            const botMessage = `New board ${newBoard.name} has been created! \n\nYou can view the changes by following the link: \nhttps://tundra-workspace.ru/project/${req.projectId}`        
            tgBot.sendNotification(req.projectId, botMessage)

            return res.status(201).json({message: "Board created"})
        }
        catch(e){
            console.log(e);
            return next(e)
        }
    }

    async updateBoard(req, res, next){
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

    async deleteBoard(req, res, next){
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
                        model: KanbanBoard,
                        required: false,
                        include: [
                            {
                                model: KanbanColumn,
                                required: false,
                                include: [
                                    {
                                        model: KanbanTask,
                                        required: false,
                                        
                                    }
                                ]
                            }
                        ]
                    }
                ],
                where: {id}
            })

            return res.status(200).json(project)

        }catch(e){
            console.log(e);
            return next(e)
        }
    }
}

module.exports = new KanbanController()