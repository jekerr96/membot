const BaseRow = require("../base-row");

class UserRow extends BaseRow {
    isAdmin() {
        return this.data.admin;
    }

    getVkId() {
        return this.data.userId;
    }
}

module.exports = UserRow;