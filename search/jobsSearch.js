const data = require("../data");
const job = data.jobs;

module.exports = [
    function keywordSearchAND(keywordList)  {
        let allJobs = job.getAllJobs();
        // To do
        let matchedJobs = []
        return matchedJobs;
    },

    function keywordSearchOR(keywordList) {
        let allJobs = job.getAllJobs();
        // To do
        let matchedJobs = [];
        return matchedJobs;
    }
]