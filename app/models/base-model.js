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

    getCollectionName() {
        return undefined;
    }
}

module.exports = BaseModel;