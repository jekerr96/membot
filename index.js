require("dotenv").config();
const VkBot = require("./app/bots/vk");

(async () => {
    try {
        let db = require("./app/db/connect");
        global.dbConnection = await db.getConnection();
        require("./app/express");
    } catch (e) {
        console.error(e.message);
        return;
    }

    global.vkBot = new VkBot(process.env.vk);
})();