class BaseRow {
    constructor(data) {
        this.data = data;
    }

    getInternalId() {
        return this.data._id;
    }

    getData() {
        return this.data;
    }
}

module.exports = BaseRow;