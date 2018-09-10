let makeDate = function() {
    let d = new Date();
    let formatDate = "";

    formatDate += (d.getMonth() + 1) + "_";

    formatDate += d.getDate() + "_";

    formatDate += d.getFullYear();

    return formatDate;
};

module.exports = makeDate;