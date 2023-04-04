const {User} = require('../models/models')
const ApiError = require('../errors/ApiError')
const { where } = require('sequelize')
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

}

module.exports = new UserController()