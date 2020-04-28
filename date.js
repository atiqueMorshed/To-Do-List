//jshint esversion:6

// returns date
// module.exports.getDate = function () {
// or
exports.getDate = function () {
    const date = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    return date.toLocaleDateString("en-US", options);
};

// returns day
exports.getDay = function() {
    const date = new Date();
    const options = {
        weekday: "long"
    };
    return date.toLocaleDateString("en-US", options);
};
