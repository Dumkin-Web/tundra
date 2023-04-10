require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const { Server } = require("socket.io");

const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const tgBot = require('./tgBot')


const PORT = process.env.PORT || 3001;


const app = express()
const server = require('http').createServer(app);
const io = require('./ws/wsController')(server)

const bot = new tgBot()

//console.log(io);

app.use(cors())
app.use(express.json())
app.use('/api', router)


app.use(errorHandler)

const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        await projectTypesInit() //создание дефолтных типов проекта
        server.listen(PORT, () => console.log(`App is runnig on port ${PORT}`))

    } catch(e) {
        console.log(e);
    }
}

const projectTypesInit = async () => {
    try{
        let newType = await models.ProjectType.findAndCountAll()

        if(newType.count === 0){
            newType = await models.ProjectType.create({name: "Kanban"})
            newType = await models.ProjectType.create({name: "Scrum"})
            //newType = await models.ProjectType.create({name: "Scrumban"})
        }
    }
    catch(e){

    }
}

start()