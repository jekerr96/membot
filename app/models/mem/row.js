const BaseRow = require("../base-row");

class MemRow extends BaseRow {
    getCode() {
        return this.data.code;
    }
}

module.exports = MemRow;