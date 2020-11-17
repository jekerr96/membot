const BaseRow = require("../base-row");

class AudioRow extends BaseRow {
    getCode() {
        return this.data.code;
    }
}

module.exports = AudioRow;