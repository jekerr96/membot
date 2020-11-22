const mongodb = require("mongodb");

class BaseModel {
    constructor() {
        this.collection = {};

        const collectionName = this.getCollectionName();

        if (!collectionName) throw new Error("Collection name is undefined");

        this.collection = global.dbConnection.collection(collectionName);
    }

    async addItem(data) {
        return await this.addItems([data]);
    }

    async addItems(arrayData) {
        let res = await this.collection.insertMany(arrayData);
        return !!res.result.ok;
    }

    update(filter, params) {
        return this.collection.updateOne(filter, params);
    }

    async getAllElements() {
        let items = await this.collection.find().toArray();
        let itemsRow = [];

        items.forEach(item => {
            itemsRow.push(this.createNewRow(item));
        });

        return itemsRow;
    }

    async getElementById(id) {
        id = this.convertArrayIdToObjectId([id]);

        let element = await this.collection.findOne({_id: {$in: id}});
        return this.createNewRow(element);
    }

    convertArrayIdToObjectId(arrayId) {
        arrayId = arrayId.map(item => {
            return mongodb.ObjectId(item);
        });

        return arrayId;
    }

    async getItemsByArrayId(arrayId) {
        arrayId = this.convertArrayIdToObjectId(arrayId);

        let items = await this.collection.find({_id: {$in: arrayId}}).toArray();

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