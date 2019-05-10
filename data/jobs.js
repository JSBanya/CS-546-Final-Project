const mongoCollections = require("../data/Collections");
const jobs = mongoCollections.jobs;
const uuid = require("node-uuid");

let exportedMethods = {
    /**
     * Grabs all jobs in the collections
     */
    async getAllJobs() {

    }

    /**
     * Grabs the job with the given id
     */
    async getJobById(id) {

    }

    /**
     * Adds a job of the given object
     */
    async addJob(newJob) {

    }

    /**
     * Removes a job with the given id
     */
    async removeJob() {

    }

    /**
     * Updates a job with the given id and object
     */
    async updateJob(id, updatedJob) {

    }
};

module.exports = exportedMethods;
