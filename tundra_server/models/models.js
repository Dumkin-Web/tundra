const sequelize = require('../db')
const {DataTypes} = require('sequelize')

//USER
const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    fullName: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    refreshToken: {type: DataTypes.STRING, defaultValue: ""},
})

//PROJECT
const UserProjects = sequelize.define('user_projects', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Project = sequelize.define('project', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    creation_date: {type: DataTypes.DATE},
    ownerId: {type: DataTypes.INTEGER},
})

const ProjectType = sequelize.define('project_type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
})


//KANBAN
const KanbanBoard = sequelize.define('kanban_board', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
})

const KanbanColumn = sequelize.define('kanban_column', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    color: {type: DataTypes.STRING, defaultValue: "#FFFFFF"},
    wip: {type: DataTypes.INTEGER, defaultValue: 999},
    order: {type: DataTypes.INTEGER}
})

const KanbanTask = sequelize.define('kanban_task', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    description: {type: DataTypes.TEXT, defaultValue: ""},
    done: {type: DataTypes.BOOLEAN, defaultValue: false},
    timeSpent: {type: DataTypes.STRING, allowNull: true}, //количество потраченного на задачу времени
    deadline: {type: DataTypes.DATE, allowNull: true}, //срок завершения задачи
    creation_date: {type: DataTypes.DATE, defaultValue: Date.now()}, //дата создания задачи
    inWork: {type: DataTypes.DATE, allowNull: true}, //дата, когда задача была начата
    order: {type: DataTypes.INTEGER}, //Последовательность
    executorId: {type: DataTypes.INTEGER, defaultValue: -1} //Исполнитель задачи
})

//CHAT

const Chat = sequelize.define('chat', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Message = sequelize.define('message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.TEXT},
    senderId: {type: DataTypes.INTEGER},
})

//PRIVATE DIALOG //NEW!!!

const UserDialogs = sequelize.define('user_dialogs', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Dialog = sequelize.define('dialog', {
    id: {type:  DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const DialogMessage = sequelize.define('dialog_message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.TEXT},
    senderId: {type: DataTypes.INTEGER},
})

User.belongsToMany(Project, {through: UserProjects})
Project.belongsToMany(User, {through: UserProjects})

ProjectType.hasMany(Project)
Project.belongsTo(ProjectType)

Project.hasOne(Chat, {onDelete: 'cascade'})
Chat.belongsTo(Project)

Chat.hasMany(Message, {onDelete: 'cascade'})
Message.belongsTo(Chat)

Project.hasMany(KanbanBoard, {onDelete: 'cascade'})
KanbanBoard.belongsTo(Project)

KanbanBoard.hasMany(KanbanColumn, {onDelete: 'cascade'})
KanbanColumn.belongsTo(KanbanBoard)

KanbanColumn.hasMany(KanbanTask, {onDelete: 'cascade'})
KanbanTask.belongsTo(KanbanColumn)

//NEW!!!(DIALOG)

User.belongsToMany(Dialog, {through: UserDialogs})
Dialog.belongsToMany(User, {through: UserDialogs})

Dialog.hasMany(DialogMessage, {onDelete: 'cascade'})
DialogMessage.belongsTo(Dialog)



//EXPORTS//
module.exports = {
    User, 
    UserProjects, 
    Project, 
    ProjectType, 
    KanbanBoard, 
    KanbanColumn, 
    KanbanTask, 
    Chat, 
    Message,
    UserDialogs,
    Dialog,
    DialogMessage
}