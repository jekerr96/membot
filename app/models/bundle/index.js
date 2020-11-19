const BaseModel = require("../base-model");
const BundleRow = require("./row");

class BundleModel extends BaseModel {
    async getFirstBundle() {
        let bundle = await this.collection.findOne();
        return this.createNewRow(bundle);
    }

    getCollectionName() {
        return "bundle";
    }

    getRowClass() {
        return BundleRow;
    }
}

module.exports = BundleModel;