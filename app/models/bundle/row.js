const BaseRow = require("../base-row");
const AudioModel = require("../audio");
const MemModel = require("../mem");

class BundleRow extends BaseRow {
    async getCodesForSend() {
        let audioModel = new AudioModel();
        let memModel = new MemModel();

        let audios = await audioModel.getItemsByArrayId(this.getAudiosId());
        let mems = await memModel.getItemsByArrayId(this.getMemsId());

        let result = [];

        audios.forEach(audio => {
            result.push(audio.getCode());
        });

        mems.forEach(mem => {
            result.push(mem.getCode());
        });

        return result.join(",");
    }

    getAudiosId() {
        return this.data.audios;
    }

    getMemsId() {
        return this.data.mems;
    }
}

module.exports = BundleRow;