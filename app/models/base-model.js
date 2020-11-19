const mongodb = require("mongodb");

class BaseModel {
    constructor() {
        this.collection = {};

        const collectionName = this.getCollectionName();

        if (!collectionName) throw new Error("Collection name is undefined");

        this.collection = global.dbConnection.collection(collectionName);
    }

    update(filter, params) {
        return this.collection.updateOne(filter, params);
    }

    convertArrayIdToObjectId(arrayId) {
        arrayId = arrayId.map(item => {
            return mongodb.ObjectId(item);
        });

        return arrayId;
    }

    async getItemsByArrayId(arrayId) {
        arrayId = this.convertArrayIdToObjectId(arrayId);

        let items = await this.collection.find({"_id": {$in: arrayId}}).toArray();

        let itemsRow = [];

        items.forEach(item => {
            itemsRow.push(this.createNewRow(item));
        });

        return itemsRow;
    }

    getCollectionName() {
        return undefined;
    }

    getRowClass() {
        return undefined;
    }

    createNewRow(data) {
        let rowClass = this.getRowClass();

        if (!rowClass) return undefined;

        return new rowClass(data);
    }
}

module.exports = BaseModel;