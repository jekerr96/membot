const MemRow = require("./row");
const BaseModel = require("../base-model");

class MemModel extends BaseModel {
    async getRandomMem() {
        let mem = await this.collection.aggregate([{$sample: {size: 1}}]);
        mem = await mem.toArray();
        return new MemRow(mem[0]);
    }

    getRowClass() {
        return MemRow;
    }

    getCollectionName() {
        return "mems";
    }
}

module.exports = MemModel;