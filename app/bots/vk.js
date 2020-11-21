const VkBotApi = require("node-vk-bot-api");
const User = require("../models/user");
const Mem = require("../models/mem");
const Bundle = require("../models/bundle");
const Audio = require("../models/audio");
const {defaultKeyboard, adminKeyboard} = require("../keyboards");
const Messages = require("../messages");

class VkBot {
    constructor(token) {
        this.bot = new VkBotApi(token);
        this.token = token;

        this.initBot();
    }

    initBot() {
        let userModel = new User();
        let memModel = new Mem();
        let audioModel = new Audio();
        let bundleModel = new Bundle();

        this.bot.use(async (ctx, next) => {
            try {
                await userModel.addUserIfNotExist(ctx.message.peer_id);
                await next();
            } catch (e) {
                console.error(e);
            }
        });

        this.bot.command(Messages.GIVE_MEM, async (ctx) => {
            let randomMem = await memModel.getRandomMem();
            ctx.reply("Держи мемчик", randomMem.getCode(), defaultKeyboard);
        });

        this.bot.command(Messages.GIVE_BUNDLE, async (ctx) => {
            let bundle = await bundleModel.getFirstBundle();
            let codes = await bundle.getCodesForSend();
            ctx.reply("Держи набор", codes, defaultKeyboard);
        });

        this.bot.command(Messages.GIVE_AUDIO, async (ctx) => {
            let randomAudio = await audioModel.getRandomAudio();
            ctx.reply("Делай громче", randomAudio.getCode(), defaultKeyboard);
        });

        this.bot.command(Messages.ADD_MEM, async (ctx) => {
            let user = await userModel.addUserIfNotExist(ctx.message.peer_id);

            if (!user.isAdmin()) {
                ctx.reply('Что будем делать?', null, defaultKeyboard);
            }

            ctx.reply('Что будем делать?', null, adminKeyboard);
        });

        this.bot.on(async (ctx) => {
            let user = await userModel.addUserIfNotExist(ctx.message.peer_id)
            ctx.reply('Что будем делать?', null, user.isAdmin() ? adminKeyboard : defaultKeyboard);
        });

        this.bot.startPolling(() => {
            console.log('Bot started.');
        });
    }

    getBot() {
        return this.bot;
    }
}

module.exports = VkBot;