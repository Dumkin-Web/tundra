const {User, Project, ProjectType} = require('../models/models')

module.exports = function(projectType){

    return async function(req, res, next){
        try{
            if(!req.projectId){
                return res.status(500).json({message: "Project id expected"})
            }

            const project = await ProjectType.findOne({
                include: [{
                    model: Project,
                    required: true,
                    where:{
                        id: req.projectId
                    }
                }],
            })

            if(projectType != project.name){
                return res.status(400).json("Query doesnt satisfy project type")
            }

            next()
        }
        catch(e){
            console.log(e);
            return res.status(500).json("Unexpected error")
        }
    }
}