const {User, KanbanTask, Chat, Project, Dialog} = require('../models/models')
const ApiError = require('../errors/ApiError')
const { where, Op } = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJWT = (email, fullName, id) => {
    return jwt.sign({email, fullName, id}, process.env.JWT_SECRET_KEY, {expiresIn: "24h"})
}

class UserController {

    async registration(req, res, next){
        const {email, fullName, password} = req.body
        try{

            if(!email || !password){
                return next(ApiError.badRequest('Missing email or password'))
            }

            const candidate = await User.findOne({where: {email}})
            if(candidate){
                return next(ApiError.internal('User already exists'))
            }

            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({email, fullName, password: hashPassword})

            return res.json({token: generateJWT(email, fullName, user.id)})
        } catch(e){
            console.log(e);
            return next(e)
        }
        
    }

    async authorization(req, res, next){
        const {email, password} = req.body
        try{

            if(!email || !password){
                return next(ApiError.internal('Missing email or password'))
            }

            const user = await User.findOne({where: {email}})
            if(!user){
                return next(ApiError.badRequest('Not valid email or password'))
            }

            let comparedPassword = bcrypt.compareSync(password, user.password)
            if(!comparedPassword){
                return next(ApiError.badRequest('Not valid email or password'))
            }

            return res.json({token: generateJWT(user.email, user.fullName, user.id)})
        } catch(e){
            return next(e)
        }
    }

    async check(req, res, next){
        return res.json({token: generateJWT(req.user.email, req.user.fullName, req.user.id)})
    }

    async getUser(req, res, next){
        
        const id = req.params.userId

        if(!id){
            return next(ApiError.badRequest('User id expected'))
        }

        const user = await User.findOne({where: {id}})

        if(!user){
            return next(ApiError.badRequest('Invalid user id'))
        }

        return res.status(200).json(user)
    }

    async getTasks(req, res, next){
        
        const { id } = req.user

        try{
            const tasks = await KanbanTask.findAll({where: {executorId: id}})

            //console.log(tasks);
            //Добавить остальные типы проектов
            if(!tasks){
                return res.status(200).json([])
            }
            return res.status(200).json(tasks)
        }
        catch(e){
            next(e)
        }
    }

    async getAllDialogs(req, res, next){
        
        const { id } = req.user

        try{
            const response = {}

            const projectDialogs = await Chat.findAll({
                include: [{
                    model: Project,
                    required: true,
                    include: [{
                        model: User,
                        required: true,
                        where: {id}
                    }]
                }]
            })

            const privateDialogsIds = await Dialog.findAll({
                include: [{
                    model: User,
                    required: true,
                    where: {id},
                    attributes: []
                }],
                attributes: ['id']
            })

            const dialogIds = privateDialogsIds.map(d => {
                return {id: d.id}
            })

            const privateDialogs = await Dialog.findAll({
                where: {
                    [Op.or]: dialogIds
                },
                include: [{
                    model: User,
                    where: {id: {[Op.ne]: id}}
                }]
            })

            response.projectDialogs = projectDialogs
            response.privateDialogs = privateDialogs

            // if(!projectDialogs){
            //     return res.status(200).json([])
            // }
            return res.status(200).json(response)
        }
        catch(e){
            next(e)
            console.log(e);
        }
    }

    async updateUser(req, res, next){
        
        const { id } = req.user

        const newUserData = req.body

        try{
            const user = await User.findOne({where: {id}})

            if(newUserData.password){
                const hashPassword = await bcrypt.hash(newUserData.password, 5)
                user.password = hashPassword;
                delete newUserData.password;
            }

            Object.keys(newUserData).forEach((key) => {
                if(user[key] !== undefined){
                    user[key] = newUserData[key]
                }
            })
            

            user.save()
            return res.status(200).json({token: generateJWT(user.email, user.fullName, user.id)})
        }
        catch(e){
            next(e)
            console.log(e);
        }
    }

}

module.exports = new UserController()