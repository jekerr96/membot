const BaseRow = require("../base-row");

class AudioRow extends BaseRow {
    getCode() {
        return this.data.code;
    }

    getName() {
        return this.data.name || this.getCode();
    }
}

module.exports = AudioRow;