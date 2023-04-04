const {User, UserProjects} = require('../models/models')

module.exports = async function(req, res, next){
    try{
        if(!req.params.projectId){
            return res.status(500).json({message: "Project id expected"})
        }
        const project = await UserProjects.findOne({where:{
            userId: req.user.id,
            projectId: req.params.projectId
        }})
        if(!project){
            return res.status(403).json({message: "Access to project denied"})
        }

        req.projectId = req.params.projectId

        next()
    }
    catch(e){
        console.log(e);
        return res.status(500).json("Unexpected error")
    }
}