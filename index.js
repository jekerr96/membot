require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

const VkBot = require("node-vk-bot-api");
const User = require("./app/models/user");
const Mem = require("./app/models/mem");
const Bundle = require("./app/models/bundle");
const Audio = require("./app/models/audio");
const {defaultKeyboard, adminKeyboard} = require("./app/keyboards");
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
    let bundleModel = new Bundle();

    global.vkBot.use(async (ctx, next) => {
        try {
            await userModel.addUserIfNotExist(ctx.message.peer_id);
            await next();
        } catch (e) {
            console.error(e);
        }
    });

    global.vkBot.command(Messages.GIVE_MEM, async (ctx) => {
        let randomMem = await memModel.getRandomMem();
        ctx.reply("Держи мемчик", randomMem.getCode(), defaultKeyboard);
    });

    global.vkBot.command(Messages.GIVE_BUNDLE, async (ctx) => {
        let bundle = await bundleModel.getFirstBundle();
        let codes = await bundle.getCodesForSend();
        ctx.reply("Держи набор", codes, defaultKeyboard);
    });

    global.vkBot.command(Messages.GIVE_AUDIO, async (ctx) => {
        let randomAudio = await audioModel.getRandomAudio();
        ctx.reply("Делай громче", randomAudio.getCode(), defaultKeyboard);
    });

    global.vkBot.command(Messages.ADD_MEM, async (ctx) => {
        let user = await userModel.addUserIfNotExist(ctx.message.peer_id);

        if (!user.isAdmin()) {
            ctx.reply('Что будем делать?', null, defaultKeyboard);
        }

        ctx.reply('Что будем делать?', null, adminKeyboard);
    });

    global.vkBot.on(async (ctx) => {
        let user = await userModel.addUserIfNotExist(ctx.message.peer_id)
        ctx.reply('Что будем делать?', null, user.isAdmin() ? adminKeyboard : defaultKeyboard);
    });

    global.vkBot.startPolling(() => {
        console.log('Bot started.');
    });


    ///////////////////
    app.use(express.static('public'));

    app.set("view engine", "pug");
    app.disable('x-powered-by');

    app.get("/", async (req, res) => {
        let bundle = await bundleModel.getAllElements();

        res.render("index", {title: "membot", message: "hello world", pageType: "main", bundles: bundle});
    });

    app.post("/bot/send-bundle-all/", async (req, res) => {
        let usersId = await userModel.getArrayUsersId();
        let msg = req.body.bundleText;
        let bundle = await bundleModel.getElementById(req.body.bundleId);

        if (!bundle) {
            req.send({
                success: false
            });

            return;
        }

        let codes = await bundle.getCodesForSend();

        usersId.forEach(userId => {
            //какого то хрена сообщения не отправляются если делать это синхронно
            setTimeout(() => {
                global.vkBot.sendMessage(userId, msg, codes, defaultKeyboard);
            }, 1);
        });

        res.send({
            success: true,
        });
    });

    app.listen(port, () => {
        console.log(`server start on http://localhost:${port}`);
    });
})();