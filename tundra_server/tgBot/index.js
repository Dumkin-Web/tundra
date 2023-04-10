const { Telegraf } = require('telegraf');
const { Project } = require('../models/models');

class TgBot{

    static bot = new Telegraf(process.env.BOT_TOKEN);

    constructor(){
        try{
            TgBot.bot.launch()

            TgBot.bot.start((ctx) => {
                console.log(ctx.chat.type);
                if(ctx.chat.type == 'group'){
                    ctx.reply('To connect your Tundra project send: \n"/connect <PROJECT BOT TOKEN>" \n\nYou can find project bot token in project settings\nOnly for project owner')
                }
                else{
                    ctx.reply('To start receive project updates, invite me in your project chat and send "/start"')
                }
            })

            TgBot.bot.command('connect', (ctx) => {
                if(ctx.chat.type == 'group'){
                    const botToken = ctx.message.text.replace('/connect', '').trim();
                    console.log(botToken);
                    console.log(botToken.length);
                    if(String(botToken).replaceAll("-", "").match(/[A-z0-9]/) && String(botToken).replaceAll("-", "").length == 32){
                        
                        Project.findOne({where: {botToken}}).then(project => {
                            if(!project.tgChatId){
                                project.tgChatId = ctx.chat.id
                                project.save()
                                ctx.reply('Project connected!')
                            }
                            else{
                                ctx.reply('Project is already connected!')
                            }
                        })
                    }
                    else{
                        ctx.reply('Invalid id')
                    }
        
        
                }
            })

            TgBot.bot.catch((err, ctx) => {
                console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
            })
        }
        catch(e){
            console.log(e);
        }

        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));

    }

    static sendNotification = async function(projectId, message){
        const project = await Project.findOne({where: {id: projectId}})

        if(project.tgChatId){
            try{
                TgBot.bot.telegram.sendMessage(project.tgChatId, message).then(res => {
                    if(res.error){
                        project.tgChatId = null
                        project.save()
                    }
                })
            }
            catch(e){
                console.log(e);
            }
        }
    }

}

module.exports = TgBot