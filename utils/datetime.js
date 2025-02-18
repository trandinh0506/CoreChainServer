const moment = require("moment");

function toUTC(dateString) {
    const date = moment(dateString, "DD-MM-YYYY").toDate();

    return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
    );
}

module.exports = toUTC;
