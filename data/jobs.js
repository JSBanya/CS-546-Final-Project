const mongoCollections = require("../data/Collections");
const jobs = mongoCollections.jobs;
const uuid = require("node-uuid");

    /**
     * Grabs all jobs in the collections sorted by date
     * @return jobs All the jobs in the collection sorted by date
     */
    const getAllJobs = async() => {

    };

    /**
     * Grabs the job with the given job id
     * @param jobId The id of the requested job
     * @return job The job matching the given id
     */
    const getJobById = async(jobId) => {

    };

    /**
     * Adds a job of the given object under the given employer id
     * @param employerId The id of the employer that is posting the new job
     * @param newJob The new job object to be added
     * @return none Throws an error if the job was not added
     */
    const addJob = async(employerId, newJob) => {

    };

    /**
     * Removes a job with the given job id
     * @param jobId The id of the requested job to be removed
     * @return none Throws an error if the job was not removed
     */
    const removeJob = async(jobId) => {

    };

    /**
     * Updates a job posting to open
     * @param jobId The id of the job to be opened
     * @return none Throws an error if the job was not opened
     */
    const openJob = async(jobId) => {

    };
    
    /**
     * Updates a job posting to closed
     * @param jobId The id of the job to be closed
     * @return none Throws an error if the job was not closed
     */
    const closeJob = async(jobId) => {

    };

    /**
     * Updates a job with a new title
     * @param jobId The id for the job to be updated
     * @param newTitle The new title for the requested job
     * @return none Throws an error if the job title was not updated
     */
    const updateJobTitle = async(jobId, newTitle) => {

    };

    /**
     * Updates a job with a new description
     * @param jobId The id for the job to be updated
     * @param newDesc The new description for the requested job
     * @return none Throws an error if the job description was not updated
     */
    const updateJobDesc = async(jobId, newDesc) => {

    };

    /**
     * Add the given skills to a job
     * @param jobId The id for the job to be updated
     * @param newSkills The new skills for the requested job
     * @return none Throws an error if the skills were not added
     */
    const addSkills = async(jobId, newSkills) => {

    };

    /**
     * Remove the given skills from a job
     * @param jobId The id for the job to be updated
     * @param skills The skills to be removed from the requested job
     * @return none Throws an error if the skills were not removed
     */
    const removeSkills = async(jobId, skills) => {

    };

    /**
     * Updates a job with a new rate
     * @param jobId The id for the job to be updated
     * @param newRate The new rate for the requested job
     * @return none Throws an error if the job rate was not updated
     */
    const updateJobRate = async(jobId, newRate) => {

    };

    /**
     * Updates a job with a new rate type
     * @param jobId The id for the job to be updated
     * @param newRateType The new rate type for the requested job
     * @return none Throws an error if the job rate type was not updated
     */
    const updateJobRateType = async(jobId, newRateType) => {

    };

    /**
     * Updates a job with a new type
     * @param jobId The id for the job to be updated
     * @param newType The new type for the requested job
     * @return none Throws an error if the job type was not updated
     */
    const updateJobType = async(jobId, newType) => {

    }

module.exports = {
    getAllJobs,
    getJobsById,
    addJob,
    removeJob,
    openJob,
    closeJob,
    updateJobTitle,
    updateJobDesc,
    addSkills,
    removeSkills,
    updateJobRate,
    updateJobRateType,
    updateJobType,
};
