const mongoCollections = require("../data/collections");
const candidates = mongoCollections.candidates;
const uuid = require("uuid");

/**
 * Grabs all candidates in the collection
 * @return candidates A list of all the candidates in the collection
 */
const getAllCandidates = async() => {
    const candidatesCollection = await candidates();
    const candidatesList = await candidatesCollection.find({}).toArray();
    if(!candidatesList) {
        throw "ERROR: Candidates collection may not exist";
    }
    return candidatesList;
};

/**
 * Grabs all candidates that match all the given keywords
 * @param keywords A list of all the keywords to find candidates
 * @return candidates A list of candidates that match the keywords
 */
const candidateSearch = async(keywords) => {
    if (!keywords) {
        throw "ERROR: No keywords provided";
    }
    const candidatesCollection = await candidates();
    const filteredCandidates = await candidatesCollection.find({profile: 
                                                            {skills: 
                                                                {$and:
                                                                    keywords.map(k => ({
                                                                        $elemMatch: {name: k}}
                                                                    ))
                                                                }
                                                            }
                                                        });

    return filteredCandidates;
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
 * @return none Throws an error if the candidate was not removed
 */
const removeCandidate = async(candidateId) => {
    if (!candidateId) {
        throw "ERROR: No id provided";
    }
    const candidateCollection = await candidates();
    const candidate = await candidateCollection.findOne({ _id: candidateId });
    const deletedCandidate = await candidateCollection.removeOne({ _id: candidate._id });
    if (deletedCandidate.deletedCount === 0) {
        throw `Sorry, we could not find an animal with the id ${candidateId}.`;
    }

    return candidate;
   
};

/**
 * Update a candidate name with the given id and name
 * @param candidateId The given id for the candidate to be updated
 * @param newName The new name for the candidate
 * @return none Throws an error if the candidate name was not updated
 */
const updateCandidateName = async(candidateId, newName) => {
    if (!candidateId || !newName) {
        throw "ERROR: Not enough arguments given to update function";
    }

    let updatedCandidate = {"profile": {"name": newName} };

    const updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});

    if (!updated) {
        throw "ERROR: There was an error updating the candidate";
    }
};

/**
 * Update a candidate biography with the given id and biography
 * @param candidateId The given id for the candidate to be updated
 * @param newBio The new biography for the candidate
 * @return none Throws an error if the candidate biography was not updated
 */
const updateCandidateBio = async(candidateId, newBio) => {

};

/**
 * Add the given skills to a candidate
 * @param candidateId The id for the candidate to be updated
 * @param newSkills The new skills for the requested candidate
 * @return none Throws an error if the candidate skills were not added
 */
const addSkills = async(candidateId, newSkills) => {

};

/**
 * Remove the given skills from a candidate
 * @param candidateId The id for the candidate to be updated
 * @param skills The skills to be removed from the requested candidate
 * @return none Throws an error if the candidate skills were not removed
 */
const removeSkills = async(candidateId, skills) => {

};

/**
 * Add the given experiences to a candidate
 * @param candidateId The id for the candidate to be updated
 * @param newExp The new experiences for the requested candidate
 * @return none Throws an error if the candidate experiences were not added
 */
const addExp = async(candidateId, newExp) => {

};

/**
 * Remove the given experiences from a candidate
 * @param candidateId The id for the candidate to be updated
 * @param exp The experiences to be removed from the requested candidate
 * @return none Throws an error if the candidate experiences were not removed
 */
const removeExp = async(candidateId, exp) => {

};

/**
 * Update a candidate image with the given id and image
 * @param candidateId The given id for the candidate to be updated
 * @param newImg The new image for the candidate
 * @return none Throws an error if the candidate image was not updated
 */
const updateCandidateImg = async(candidateId, newImg) => {

};

/**
 * Sends in application notice to the company that posted the job
 * @param candidateId The given id for the candidate that applied
 * @param jobId The given id for the job that was applied to
 * @return none Throws an error if the candidate application message was not sent
 */
const applyToJob = async(candidateId, jobId) => {

};

/**
 * Adds hired job to candidate's information
 * @param candidateId The given id for the candidate that was hired
 * @param jobId The given id for the job the candidate was hired for
 * @return none Throws an error if the job was not added to the candidate's hired list
 */
const hired = async(candidateId, jobId) => {

};

    /**
     * Adds hired job to candidate's information;
     * Assume the skill object looks like {name:"java", expeirence:1.2}
     * And the skills of candidate looks like [{name:"java", expeirence:1.2},{name:C++, expeirence:3.5}]
     * @param skill's name
     * @param exprience of the skill
     * @return a list of candidates
     */
    const searchCandidatesBySkills = async(skillName, expirence) => {
        if (!skillName || typeof (skillName) !== "string")
            throw "[ERROR] [ searchCandidatesBySkill() ] invalid skillName!";
        if (!expirence || typeof (expirence) !== "number")
            throw "[ERROR] [ searchCandidatesBySkill() ] invalid expirence!";

        let allCandidates = await getAllCandidates();
        return allCandidates.filter(x => {
            return x.skills.find(y => y.name.toLowerCase() === skillName.toLowerCase() && parseFloat(y.expeirence) >= expirence) !== undefined;
        });
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
    hired,
    searchCandidatesBySkills
};