const mongoCollections = require("./collections");
const candidates = mongoCollections.candidates;
<<<<<<< HEAD
const jobData = require("./jobs");
const employerData = require("./employers");
const uuid = require("node-uuid");

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
=======

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
>>>>>>> 6a145b893c3a02037a6827e02c6aaa8acf92aec3
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
    const candidateCollection = await candidates();
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
    if (!candidateId || !newBio) {
        throw "ERROR: Not enough arguments given to update function";
    }
    const candidateCollection = await candidates();
    let updatedCandidate = {"profile": {"bio": newBio} };

    const updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});

    if (!updated) {
        throw "ERROR: There was an error updating the candidate";
    }
};

/**
 * Add the given skills to a candidate
 * @param candidateId The id for the candidate to be updated
 * @param newSkills The new skills for the requested candidate
 * @return none Throws an error if the candidate skills were not added
 */
const addSkills = async(candidateId, newSkills) => {
    if (!candidateId || !newSkills) {
        throw "ERROR: Not enough arguments given to update function";
    }

    const candidateCollection = await candidates();
    const candidate = candidateCollection.find({ _id: candidateId});
    let currentSkills = candidate.profile.skills;
    let union = [...new Set([...currentSkills, ...newSkills])];
    let skills = Array.from(union);
    
    let updatedCandidate = {"profile": {"skills": skills}};
       
    const updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});

    if (!updated) {
        throw "ERROR: There was an error updating the candidate";
    }
};

/**
 * Remove the given skills from a candidate
 * @param candidateId The id for the candidate to be updated
 * @param oldSkills The skills to be removed from the requested candidate
 * @return none Throws an error if the candidate skills were not removed
 */
const removeSkills = async(candidateId, oldSkills) => {
    if (!candidateId || !oldSkills) {
        throw "ERROR: Not enough arguments given to update function";
    }

    const candidateCollection = await candidates();
    const candidate = candidateCollection.find({ _id: candidateId});
    let currentSkills = candidate.profile.skills;
    let skills = currentSkills.filter(s => { oldSkills.includes(s) })
    
    let updatedCandidate = {"profile": {"skills": skills}};
       
    const updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});

    if (!updated) {
        throw "ERROR: There was an error updating the candidate";
    }
};

/**
 * Add the given experiences to a candidate
 * @param candidateId The id for the candidate to be updated
 * @param newExp The new experiences for the requested candidate
 * @return none Throws an error if the candidate experiences were not added
 */
const addExp = async(candidateId, newExp) => {
    if (!candidateId || !newExp) {
        throw "ERROR: Not enough arguments given to update function";
    }

    const candidateCollection = await candidates();
    const candidate = candidateCollection.find({ _id: candidateId});
    let currentExp = candidate.profile.experience;
    let union = [...new Set([...currentExp, ...newExp])];
    let exp = Array.from(union);
    
    let updatedCandidate = {"profile": {"experience": exp}};
       
    const updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});

    if (!updated) {
        throw "ERROR: There was an error updating the candidate";
    }
};

/**
 * Remove the given experiences from a candidate
 * @param candidateId The id for the candidate to be updated
 * @param oldExp The experiences to be removed from the requested candidate
 * @return none Throws an error if the candidate experiences were not removed
 */
const removeExp = async(candidateId, oldExp) => {
    if (!candidateId || !oldExp) {
        throw "ERROR: Not enough arguments given to update function";
    }

    const candidateCollection = await candidates();
    const candidate = candidateCollection.find({ _id: candidateId});
    let currentExp = candidate.profile.experience;
    let exp = currentExp.filter(e => { oldExp.includes(e) })
    
    let updatedCandidate = {"profile": {"experience": exp}};
       

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
        const candidateCollection = await candidates();
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
        if (!candidateId || !newBio) {
            throw "ERROR: Not enough arguments given to update function";
        }
        const candidateCollection = await candidates();
        let updatedCandidate = {"profile": {"bio": newBio} };

        const updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});

        if (!updated) {
            throw "ERROR: There was an error updating the candidate";
        }
    };

    /**
     * Add the given skills to a candidate
     * @param candidateId The id for the candidate to be updated
     * @param newSkills The new skills for the requested candidate
     * @return none Throws an error if the candidate skills were not added
     */
    const addSkills = async(candidateId, newSkills) => {
        if (!candidateId || !newSkills) {
            throw "ERROR: Not enough arguments given to update function";
        }

        const candidateCollection = await candidates();
        const candidate = candidateCollection.find({ _id: candidateId});
        let currentSkills = candidate.profile.skills;
        let union = [...new Set([...currentSkills, ...newSkills])];
        let skills = Array.from(union);
        
        let updatedCandidate = {"profile": {"skills": skills}};
           
        const updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});

        if (!updated) {
            throw "ERROR: There was an error updating the candidate";
        }
    };

    /**
     * Remove the given skills from a candidate
     * @param candidateId The id for the candidate to be updated
     * @param oldSkills The skills to be removed from the requested candidate
     * @return none Throws an error if the candidate skills were not removed
     */
    const removeSkills = async(candidateId, oldSkills) => {
        if (!candidateId || !oldSkills) {
            throw "ERROR: Not enough arguments given to update function";
        }

        const candidateCollection = await candidates();
        const candidate = candidateCollection.find({ _id: candidateId});
        let currentSkills = candidate.profile.skills;
        let skills = currentSkills.filter(s => { oldSkills.includes(s) })
        
        let updatedCandidate = {"profile": {"skills": skills}};
           
        const updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});

        if (!updated) {
            throw "ERROR: There was an error updating the candidate";
        }
    };

    /**
     * Add the given experiences to a candidate
     * @param candidateId The id for the candidate to be updated
     * @param newExp The new experiences for the requested candidate
     * @return none Throws an error if the candidate experiences were not added
     */
    const addExp = async(candidateId, newExp) => {
        if (!candidateId || !newExp) {
            throw "ERROR: Not enough arguments given to update function";
        }

        const candidateCollection = await candidates();
        const candidate = candidateCollection.find({ _id: candidateId});
        let currentExp = candidate.profile.experience;
        let union = [...new Set([...currentExp, ...newExp])];
        let exp = Array.from(union);
        
        let updatedCandidate = {"profile": {"experience": exp}};
           
        const updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});

        if (!updated) {
            throw "ERROR: There was an error updating the candidate";
        }
    };

    /**
     * Remove the given experiences from a candidate
     * @param candidateId The id for the candidate to be updated
     * @param oldExp The experiences to be removed from the requested candidate
     * @return none Throws an error if the candidate experiences were not removed
     */
    const removeExp = async(candidateId, oldExp) => {
        if (!candidateId || !oldExp) {
            throw "ERROR: Not enough arguments given to update function";
        }

        const candidateCollection = await candidates();
        const candidate = candidateCollection.find({ _id: candidateId});
        let currentExp = candidate.profile.experience;
        let exp = currentExp.filter(e => { oldExp.includes(e) })
        
        let updatedCandidate = {"profile": {"experience": exp}};
           
        const updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});

        if (!updated) {
            throw "ERROR: There was an error updating the candidate";
        }
    };

    /**
     * Update a candidate image with the given id and image
     * @param candidateId The given id for the candidate to be updated
     * @param newImg The new image for the candidate
     * @return none Throws an error if the candidate image was not updated
     */
    const updateCandidateImg = async(candidateId, newImg) => {
        if (!candidateId || !newImg) {
            throw "ERROR: Not enough arguments given to update function";
        }
        const candidateCollection = await candidates();
        let updatedCandidate = {"profile": {"imageRef": newImg} };

        const updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});

        if (!updated) {
            throw "ERROR: There was an error updating the candidate";
        }
    };

    /**
     * Sends in application notice to the company that posted the job
     * @param candidateId The given id for the candidate that applied
     * @param jobId The given id for the job that was applied to
     * @return none Throws an error if the candidate application message was not sent
     */
    const applyToJob = async(candidateId, jobId) => {
        if (!candidateId || !jobId) {
            throw "ERROR: Not enough arguments given to update function";
        }

        const candidateCollection = await candidates();
        let candidate = await candidateCollection.find({ _id: candidateId });
        let newApplied = (candidate.applied).push(jobId);
        let updatedCandidate = { "applied": newApplied };
        let updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});
        let employerId = (jobData.getJobById(jobId)).owner;
        let job = await jobData.getJobById(jobId);
        let newMessage = `The candidate, ${candidate.profile.name}, has applied to your posting for position, ${job.title}.`;
        await messageData.sendMessageToEmpl(candidateId, employerId, newMessage);
        return updated;
    };

    /**
     * Adds hired job to candidate's information
     * @param candidateId The given id for the candidate that was hired
     * @param jobId The given id for the job the candidate was hired for
     * @return none Throws an error if the job was not added to the candidate's hired list
     */
    const hired = async(candidateId, jobId) => {
        if (!candidateId || !jobId) {
            throw "ERROR: Not enough arguments given to update function";
        }

        const candidateCollection = await candidates();
        let candidate = await candidateCollection.find({ _id: candidateId });
        let newApplied = (candidate.applied).push(jobId);
        let updatedCandidate = { "applied": newApplied };

        let updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});
        return updated;
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