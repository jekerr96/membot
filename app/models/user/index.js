const BaseModel = require("../base-model");
const api = require("node-vk-bot-api/lib/api");

class Index extends BaseModel {
    async addUserIfNotExist(userId) {
        let user = await this.collection.findOne({userId});

        if (user) return false;

        let apiRes = await api("users.get", {
            user_ids: userId,
            access_token: process.env.vk,
            fields: "city"
        })
        this.collection.insertOne({
            userId,
            ...apiRes.response[0],
        });
    }

    getCollectionName() {
        return "users";
    }
}

module.exports = Index;