const BaseModel = require("../base-model");
const AudioRow = require("./row");

class AudioModel extends BaseModel {
    async getRandomAudio() {
        let Audio = await this.collection.aggregate([{$sample: {size: 1}}]);
        Audio = await Audio.toArray();
        return new AudioRow(Audio[0]);
    }

    getCollectionName() {
        return "audio";
    }
}

module.exports = AudioModel;