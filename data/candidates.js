const mongoCollections = require("../data/collections");
const candidates = mongoCollections.candidates;
const uuid = require("node-uuid");

    /**
     * Grabs all candidates in the collection
     * @return candidates A list of all the candidates in the collection
     */
    const getAllCandidates = async() => {

    };

    /**
     * Grabs all candidates that match all the given keywords
     * @param keywords A list of all the keywords to find candidates
     * @return candidates A list of candidates that match the keywords
     */
    const candidateSearch = async(keywords) => {

    };

    /**
     * Grabs the candidate with the given id
     * @param candidateId The id of the requested candidate
     * @return candidate The candidate matching the given id
     */
    const getCandidateById = async(candidateId) => {
        if(!candidateId) {
            throw "ERROR: No candidate id given";
        }

        const candidatesCollection = await candidates();
        const candidate = await candidatesCollection.findOne({ _id: id });
        if (!candidate) {
            throw "ERROR: No candidate for given id";
        }

        return candidate;
    };

    /**
     * Grabs the candidate with the given email
     * @param email The email for the requesting candidate
     * @return candidate The candidate matching the given email
     */
    const getCandidateByEmail = async (email) => {
        if (!email) {
            throw "ERROR: No email provided";
        }

        const candidatesCollection = await candidates();
        const candidate = await candidatesCollection.findOne({ email: email });
        if (!candidate) {
            throw "ERROR: No candidate for given email";
        }
    
        return candidate;
    };

    /**
     * Adds a candidate of the given profile object
     * @param profile The profile object for the new candidate
     * @return added True if the candidate was valid and added; False otherwise
     */
    const addCandidate = async(profile) => {
        if (!profile) {
            throw "ERROR: No profile given";
        }

        const candidatesCollection = await candidates();
        const info = await candidatesCollection.insertOne(c);
        if(info.insertedCount === 0) {
            throw "ERROR: Unable to add candidate to DB";
        }
    };

    /**
     * Removes a candidate by the given id
     * @param candidateId The id of teh requested candidate to delete
     * @return removed True if the candidate was removed; False otherwise
     */
    const removeCandidate = async(candidateId) => {

    };

    /**
     * Update a candidate name with the given id and name
     * @param candidateId The given id for the candidate to be updated
     * @param newName The new name for the candidate
     * @return updated True if the candidate was updated; False otherwise
     */
    const updateCandidateName = async(candidateId, newName) => {

    };

    /**
     * Update a candidate biography with the given id and biography
     * @param candidateId The given id for the candidate to be updated
     * @param newBio The new biography for the candidate
     * @return updated True if the candidate was updated; False otherwise
     */
    const updateCandidateBio = async(candidateId, newBio) => {

    };

    /**
     * Add the given skills to a candidate
     * @param candidateId The id for the candidate to be updated
     * @param newSkills The new skills for the requested candidate
     * @return updated True if the candidate was updated; False otherwise
     */
    const addSkills = async(candidateId, newSkills) => {

    };

    /**
     * Remove the given skills from a candidate
     * @param candidateId The id for the candidate to be updated
     * @param skills The skills to be removed from the requested candidate
     * @return updated True if the canidate was updated; False otherwise
     */
    const removeSkills = async(candidateId, skills) => {

    };

    /**
     * Add the given experiences to a candidate
     * @param candidateId The id for the candidate to be updated
     * @param newExp The new experiences for the requested candidate
     * @return updated True if the candidate was updated; False otherwise
     */
    const addExp = async(candidateId, newExp) => {

    };

    /**
     * Remove the given experiences from a candidate
     * @param candidateId The id for the candidate to be updated
     * @param exp The experiences to be removed from the requested candidate
     * @return updated True if the canidate was updated; False otherwise
     */
    const removeExp = async(candidateId, exp) => {

    };

    /**
     * Update a candidate image with the given id and image
     * @param candidateId The given id for the candidate to be updated
     * @param newImg The new image for the candidate
     * @return updated True if the candidate was updated; False otherwise
     */
    const updateCandidateImg = async(candidateId, newImg) => {

    };

    /**
     * Sends in application notice to the company that posted the job
     * @param candidateId The given id for the candidate that applied
     * @param jobId The given id for the job that was applied to
     * @return applied True if the application is valid and was sent; False otherwise
     */
    const applyToJob = async(candidateId, jobId) => {

    };

    /**
     * Adds hired job to candidate's information
     * @param candidateId The given id for the candidate that was hired
     * @param jobId The given id for the job the candidate was hired for
     * @return hired True if the candidate was successfully hired; False otherwise
     */
    const hired = async(candidateId, jobId) => {

    };

module.exports = {
    getAllCandidates,
    candidateSearch,
	getCandidateById,
	addCandidate,
	getCandidateByEmail,
	removeCandidate,
    updateCandidateName,
    updateCandidateBio,
    updateCandidateImg,
    addSkills,
    removeSkills,
    addExp,
    removeExp,
    applyToJob,
    hired
};