const Markup = require("node-vk-bot-api/lib/markup");
const Messages = require("./messages");

const defaultKeyboard = Markup.keyboard([
    [
        Markup.button(Messages.GIVE_MEM, 'positive'),
        Markup.button(Messages.GIVE_BUNDLE, 'positive'),
        Markup.button(Messages.GIVE_AUDIO, 'positive'),
    ]
]).oneTime();

const adminKeyboard = Markup.keyboard([
    [
        Markup.button(Messages.GIVE_MEM, 'positive'),
        Markup.button(Messages.GIVE_BUNDLE, 'positive'),
        Markup.button(Messages.GIVE_AUDIO, 'positive'),
    ],
    [
        Markup.button(Messages.ADD_MEM, 'positive'),
    ]
]).oneTime();

module.exports = {defaultKeyboard, adminKeyboard};