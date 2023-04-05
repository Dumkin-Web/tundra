const {Project, User, UserProjects, ProjectType} = require('../models/models')
const ApiError = require('../errors/ApiError')
const { where } = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const kanbanContrller = require('./kanbanController')
const { createChat } = require('./messengerController')
const { Message } = require('../models/models')
const { Chat } = require('../models/models')

const generateJWT = (email, fullName, id) => {
    return jwt.sign({email, fullName, id}, process.env.JWT_SECRET_KEY, {expiresIn: "24h"})
}

class ProjectController {

    async createProject(req, res, next){
        const {name, projectType} = req.body
        const user = req.user
        try{

            const projectTypeId = await ProjectType.findOne({where: {
                name: projectType
            }})
            if(!projectTypeId){
                return res.status(500).json({message: "Invailid project type"})
            }

            const project = await Project.create({name, projectTypeId: projectTypeId.id, ownerId: user.id})
            const userProject = await UserProjects.create({userId: user.id, projectId: project.id})
            const chat = await createChat({projectId: project.id})

            req.body.projectName = name;
            req.body.projectId = project.id

            switch(projectTypeId.id){
                case 1:
                    await kanbanContrller.createKanban(req, res, next)
                    break;
                default:
                    res.status(501).json({message: "Not Implemented"})
                    break;

            }

        } catch(e){
            console.log(e);
            return next(e)
        }
        
    }

    async deleteProject(req, res, next){
        
        const id = req.params.projectId

        try{

            const deletedProject = await Project.destroy({where: {id}})
            const deleteRelation = await UserProjects.destroy({where: {projectId: id}})
            
            return res.status(200).json({message: 'Project was deleted'})

        } catch(e){
            console.log(e);
            return next(e)
        }
        
    }

    async projectTypes(req, res, next){
        try{

            const projectTypes = await ProjectType.findAll()
            if(!projectTypes){
                return res.status(500).json({message: "No project types"})
            }

            return res.status(200).json(projectTypes)

        } catch(e){
            console.log(e);
            return next(e)
        }
        
    }

    async getAllProjects(req, res, next){
        try{
            const response = []
            const user = req.user
            const projects = await Project.findAll({
                include: [{
                    model: User,
                    required: true,
                    where: {id: user.id}
                },
                {
                    model: ProjectType,
                    required: true
                }
                ]
            })

            return res.status(200).json(projects)

        } catch(e){
            console.log(e);
            return next(e)
        }
        
    }

    async getAllMembers(req, res, next){
        const projectId = req.params.projectId

        if(projectId == 'undefined' || !projectId){
            return next(ApiError.badRequest('Project id expected'))
        }

        try{
            //const members = await UserProjects.findAll({where: {projectId}, attributes: ['userId']})

            const members = await User.findAll({
                include: [{
                    model: Project,
                    required: true,
                    where: {id: projectId},
                    attributes: []
                }],
                attributes: ['id', 'fullName', 'email']
            })

            if(!members){
                return next(ApiError.badRequest("Project doesn't exist"))
            }

            return res.status(200).json(members)

        } catch(e){
            console.log(e);
            return next(e)
        }


    }

    async getAllMessages(req, res, next){
        const projectId = req.params.projectId

        if(projectId == 'undefined' || !projectId){
            return next(ApiError.badRequest('Project id expected'))
        }

        try{
            //const members = await UserProjects.findAll({where: {projectId}, attributes: ['userId']})

            const messages = await Message.findAll({
                include: [{
                    model: Chat,
                    required: true,
                    where: {projectId}
                }]
            })

            return res.status(200).json(messages)

        } catch(e){
            console.log(e);
            return next(e)
        }


    }

    async inviteUser(req, res, next){
        const projectId = req.params.projectId
        const {email} = req.body

        if(projectId == 'undefined' || !projectId){
            return next(ApiError.badRequest('Project id expected'))
        }

        if(!email){
            return next(ApiError.badRequest('Email expected'))
        }

        try{
            const user = await User.findOne({where: {email}})

            const project = await Project.findOne({where: {id: projectId}})

            if(!user || !project){
                return next(ApiError.badRequest("User or project don't exist"))
            }

            const candidate = await UserProjects.findOne({where: {userId: user.id, projectId}})

            console.log(candidate);

            if(candidate){
                return next(ApiError.badRequest("User already in project"))
            }

            const userProject = await UserProjects.create({userId: user.id, projectId})
            
            return res.status(200).json({message: 'User invited'})

        } catch(e){
            console.log(e);
            return next(e)
        }


    }

    async leaveFromProject(req, res, next){
        const projectId = req.params.projectId
        const {userId} = req.body

        if(projectId == 'undefined' || !projectId){
            return next(ApiError.badRequest('Project id expected'))
        }

        if(!userId){
            return next(ApiError.badRequest('User id expected'))
        }

        try{
            const project = await Project.findOne({where: {id: projectId}})

            if(project.ownerId == userId){
                return next(ApiError.badRequest("User can't leave from project, because he's owner"))
            }

            const userProject = await UserProjects.destroy({where: {userId, projectId}})
            
            return res.status(200).json({message: 'User left from project'})

        } catch(e){
            console.log(e);
            return next(e)
        }


    }

    async getProjectData(req, res, next){
        const projectId = req.params.projectId

        if(projectId == 'undefined' || !projectId){
            return next(ApiError.badRequest('Project id expected'))
        }

        try{
            const project = await Project.findOne({where: {id: projectId}})
            
            return res.status(200).json(project)

        } catch(e){
            console.log(e);
            return next(e)
        }
    }

}

module.exports = new ProjectController()