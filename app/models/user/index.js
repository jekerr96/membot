const BaseModel = require("../base-model");
const api = require("node-vk-bot-api/lib/api");
const UserRow = require("./row");

class Index extends BaseModel {
    async addUserIfNotExist(userId) {
        let user = await this.collection.findOne({userId});

        if (user) return new UserRow(user);

        let apiRes = await api("users.get", {
            user_ids: userId,
            access_token: process.env.vk,
            fields: "city"
        });

        user = {
            userId,
            ...apiRes.response[0],
        };

        this.collection.insertOne(user);

        return new UserRow(user);
    }

    getCollectionName() {
        return "users";
    }
}

module.exports = Index;