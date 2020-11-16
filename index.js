require("dotenv").config();
const VkBot = require("node-vk-bot-api");

(async () => {
    try {
        let db = require("./app/db/connect");
        global.dbConnection = await db.getConnection();
    } catch (e) {
        console.error(e.message);
        return;
    }

    global.vkBot = new VkBot(process.env.vk);
})();