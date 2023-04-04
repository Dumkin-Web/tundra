const { Chat } = require("../models/models");

class MessengerController {

    async createChat({projectId}){
        
        const chat = Chat.create({projectId})
        
    }
}

module.exports = new MessengerController()