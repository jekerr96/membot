const BaseRow = require("../base-row");

class UserRow extends BaseRow {
    isAdmin() {
        return this.data.admin;
    }
}

module.exports = UserRow;