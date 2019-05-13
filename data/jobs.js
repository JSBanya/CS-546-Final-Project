const mongoCollections = require("../data/Collections");
const jobs = mongoCollections.jobs;
const uuid = require("node-uuid");

let exportedMethods = {
    /**
     * Grabs all jobs in the collections sorted by date
     * @return jobs All the jobs in the collection sorted by date
     */
    async getAllJobs() {

    },

    /**
     * Grabs the job with the given job id
     * @param jobId The id of the requested job
     * @return job The job matching the given id
     */
    async getJobById(jobId) {

    },

    /**
     * Adds a job of the given object under the given employer id
     * @param employerId The id of the employer that is posting the new job
     * @param newJob The new job object to be added
     * @return none Throws an error if the job was not added
     */
    async addJob(employerId, newJob) {

    },

    /**
     * Removes a job with the given job id
     * @param jobId The id of the requested job to be removed
     * @return none Throws an error if the job was not removed
     */
    async removeJob(jobId) {

    },

    /**
     * Updates a job posting to open
     * @param jobId The id of the job to be opened
     * @return none Throws an error if the job was not opened
     */
    async openJob(jobId) {

    },
    
    /**
     * Updates a job posting to closed
     * @param jobId The id of the job to be closed
     * @return none Throws an error if the job was not closed
     */
    async closeJob(jobId) {

    },

    /**
     * Updates a job with a new title
     * @param jobId The id for the job to be updated
     * @param newTitle The new title for the requested job
     * @return none Throws an error if the job title was not updated
     */
    async updateJobTitle(jobId, newTitle) {

    },

    /**
     * Updates a job with a new description
     * @param jobId The id for the job to be updated
     * @param newDesc The new description for the requested job
     * @return none Throws an error if the job description was not updated
     */
    async updateJobDesc(jobId, newDesc) {

    },

    /**
     * Add the given skills to a job
     * @param jobId The id for the job to be updated
     * @param newSkills The new skills for the requested job
     * @return none Throws an error if the skills were not added
     */
    async addSkills(jobId, newSkills) {

    },

    /**
     * Remove the given skills from a job
     * @param jobId The id for the job to be updated
     * @param skills The skills to be removed from the requested job
     * @return none Throws an error if the skills were not removed
     */
    async removeSkills(jobId, skills) {

    },

    /**
     * Updates a job with a new rate
     * @param jobId The id for the job to be updated
     * @param newRate The new rate for the requested job
     * @return none Throws an error if the job rate was not updated
     */
    async updateJobRate(jobId, newRate) {

    },

    /**
     * Updates a job with a new rate type
     * @param jobId The id for the job to be updated
     * @param newRateType The new rate type for the requested job
     * @return none Throws an error if the job rate type was not updated
     */
    async updateJobRateType(jobId, newRateType) {

    },

    /**
     * Updates a job with a new type
     * @param jobId The id for the job to be updated
     * @param newType The new type for the requested job
     * @return none Throws an error if the job type was not updated
     */
    async updateJobType(jobId, newType) {

    }
};

module.exports = exportedMethods;
