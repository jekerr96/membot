require("dotenv").config();
const VkBot = require("node-vk-bot-api");
const User = require("./app/models/user");
const Mem = require("./app/models/mem");
const Audio = require("./app/models/audio");
const {defaultKeyboard} = require("./app/keyboards");
const Messages = require("./app/messages");

(async () => {
    try {
        let db = require("./app/db/connect");
        global.dbConnection = await db.getConnection();
    } catch (e) {
        console.error(e.message);
        return;
    }

    global.vkBot = new VkBot(process.env.vk);
    let userModel = new User();
    let memModel = new Mem();
    let audioModel = new Audio();

    global.vkBot.command(Messages.GIVE_MEM, async (ctx) => {
        await userModel.addUserIfNotExist(ctx.message.peer_id);
        let randomMem = await memModel.getRandomMem();
        ctx.reply("Держи мемчик", randomMem.getCode(), defaultKeyboard);
    });

    global.vkBot.command(Messages.GIVE_AUDIO, async (ctx) => {
        await userModel.addUserIfNotExist(ctx.message.peer_id);
        let randomAudio = await audioModel.getRandomAudio();
        ctx.reply("Делай громче", randomAudio.getCode(), defaultKeyboard);
    });

    global.vkBot.on(async (ctx) => {
        await userModel.addUserIfNotExist(ctx.message.peer_id)
        ctx.reply('Что будем делать?', null, defaultKeyboard);
    });

    global.vkBot.startPolling(() => {
        console.log('Bot started.');
    });
})();