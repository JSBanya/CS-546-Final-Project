const data = require("../data");
const employers = data.employers;

module.exports = [
    function keywordSearchAND(keywordList)  {
        let allEmployers = employers.getAllEmployers();
        // To do
        let matchedEmployers = []
        return matchedEmployers;
    },

    function keywordSearchOR(keywordList) {
        let allEmployers = employers.getAllEmployers();
        // To do
        let matchedEmployers = []
        return matchedEmployers;
    }
]