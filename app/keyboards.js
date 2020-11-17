const Markup = require("node-vk-bot-api/lib/markup");
const Messages = require("./messages");

const defaultKeyboard = Markup.keyboard([
    [
        Markup.button(Messages.GIVE_MEM, 'positive'),
        Markup.button(Messages.GIVE_AUDIO, 'positive'),
    ]
]).oneTime();

module.exports = {defaultKeyboard};