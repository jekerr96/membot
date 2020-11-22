const BaseRow = require("../base-row");

class MemRow extends BaseRow {
    getCode() {
        return this.data.code;
    }

    getUrl() {
        return this.data.url;
    }
}

module.exports = MemRow;