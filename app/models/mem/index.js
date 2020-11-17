const MemRow = require("./row");
const BaseModel = require("../base-model");

class Index extends BaseModel {
    async getRandomMem() {
        let mem = await this.collection.aggregate([{$sample: {size: 1}}]);
        mem = await mem.toArray();
        return new MemRow(mem[0]);
    }

    getCollectionName() {
        return "mems";
    }
}

module.exports = Index;