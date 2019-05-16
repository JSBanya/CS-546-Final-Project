const mongoCollections = require("./collections");
const candidates = mongoCollections.candidates;
const jobData = require("./jobs");
const employerData = require("./employers");
const ObjectID = require('mongodb').ObjectID;
const utils = require("./utils");
const moment = require("moment");

const validName = (firstName, lastName) => {
    if(utils.isEmpty(firstName) || utils.isEmpty(lastName) || !utils.isString(firstName) || !utils.isString(lastName)) {
        return false;
    }

    if(firstName.length > 30 || lastName.length > 30) {
        return false;
    }

    return true;
}

const validEmail = (email) => {
    if(utils.isEmpty(email) || !utils.isString(email)) {
        return false;
    }

    if(email.length > 30) {
        return false;
    }

    return true;
}

const validBiography = (bio) => {
    if(!utils.isString(bio)) {
        return false;
    }

    if(bio.length > 500) {
        return false;
    }

    return true;
}

const validSkill = (skill) => {
    if(!utils.isObject(skill) || !utils.isString(skill.skill) || utils.isEmpty(skill.skill) || !utils.isString(skill.years) || utils.isEmpty(skill.years) || isNaN(skill.years)) {
        return false;
    }

    if(skill.skill.length > 30 || skill.years < 0.1 || skill.years > 100) {
        return false;
    }

    return true;
}

const validExperience = (exp) => {
    if(!utils.isObject(exp) || !utils.isString(exp.experience) || utils.isEmpty(exp.experience) || !utils.isString(exp.description) || utils.isEmpty(exp.description) || !moment(exp.from).isValid() || !moment(exp.to).isValid()) {
        return false;
    }

    if(exp.from > exp.to) {
        return false;
    }

    if(exp.experience.length > 50 || exp.description.length > 1000) {
        return false;
    }

    return true;
}


const validLink = (link) => {
   if(!utils.isString(link)) {
        return false;
    }

    if(link.length > 100) {
        return false;
    }

    return true;
} 

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
const candidateSearch = async(keywords, years) => {
    if (!keywords) {
        throw "ERROR: No keywords provided";
    }

    if(!years) {
        throw "ERROR: No years provided";
    }

    if(!Array.isArray(keywords) || !Array.isArray(years)) {
        throw "ERROR: keywords or years not an array";
    }

    if(keywords.length != years.length) {
        throw "Lengths not equal";
    }

    const candidatesCollection = await candidates();

    let keywordInnerQuery = [];
    for(let i = 0; i < keywords.length; i++) {
        keywordInnerQuery.push({ 
            skills: { 
                $elemMatch: {
                    skill: {
                        $regex: keywords[i], $options: 'i'
                    }, 
                    years: { 
                        $gte: years[i] 
                    }
                }
            }
        });
    }
    
    const filteredCandidates = await candidatesCollection.find({ $and: keywordInnerQuery }).toArray();;
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
    const candidate = await candidatesCollection.findOne({ _id: new ObjectID(candidateId) });

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

    if(!validEmail(email)) {
        throw "invalid email";   
    }

    email = email.toLowerCase();

    const candidatesCollection = await candidates();
    const candidate = await candidatesCollection.findOne({ email: email });
    return candidate;
};

/**
* Adds a candidate of the given profile object
* @param profile The profile object for the new candidate
* @return added True if the candidate was valid and added; False otherwise
*/
const addCandidate = async(data) => {
    if (!data) {
        throw "ERROR: No profile given";
    }

    if(!validName(data.firstName, data.lastName)) {
        throw "Invalid name"
    }

    if(!validEmail(data.email)) {
        throw "Invalid email"
    }
    data.email = data.email.toLowerCase();

    if(!validBiography(data.biography)) {
        throw "Invalid biography"
    }

    if(!Array.isArray(data.skills)) {
        throw "Invalid skills";
    }

    for(let i = 0; i < data.skills.length; i++) {
        if(!validSkill(data.skills[i])) {
            throw "Invalid skill"
        }
    }

    if(!Array.isArray(data.experience)) {
        throw "Invalid experiences";
    }

    for(let i = 0; i < data.experience.length; i++) {
        if(!validExperience(data.experience[i])) {
            throw "Invalid experience"
        }
    }

    if(!Array.isArray(data.links)) {
        throw "Invalid links";
    }

    for(let i = 0; i < data.links.length; i++) {
        if(!validLink(data.links[i])) {
            throw "Invalid link"
        }
    }

    if(utils.isUndefined(data.profileImage)) {
        data.profileImage = "default.png";
    }

    const candidatesCollection = await candidates();
    const info = await candidatesCollection.insertOne(data);
    if(info.insertedCount === 0) {
        throw "ERROR: Unable to add candidate to DB";
    }
};

/**
* Update a candidate name with the given id and name
* @param candidateId The given id for the candidate to be updated
* @param newFirstName The new first name for the candidate
* @param newLastName The new last name for the candidate
* @return none Throws an error if the candidate name was not updated
*/
const updateCandidateName = async(candidateId, newFirstName, newLastName) => {
    if (!candidateId) {
        throw "ERROR: Candidate ID not provided";
    }

    if(!validName(newFirstName, newLastName)) {
        throw "Invalid name"
    }

    const candidateCollection = await candidates();
    let updatedCandidate = {firstName: newFirstName, lastName: newLastName};

    const updated = await candidateCollection.updateOne({ _id: new ObjectID(candidateId) }, {$set: updatedCandidate});
    if (updated.result.ok !== 1) {
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
     if (!candidateId) {
        throw "ERROR: Candidate ID not provided";
    }

    if(!validBiography(newBio)) {
        throw "Invalid biography"
    }

    const candidateCollection = await candidates();
    let updatedCandidate = {biography: newBio};

    const updated = await candidateCollection.updateOne({ _id: candidateId }, {$set: updatedCandidate});
    if (updated.result.ok !== 1) {
        throw "ERROR: There was an error updating the candidate";
    }
};

const updateCandidatePassword = async(candidateId, newPass) => {
    if (!candidateId) {
        throw "ERROR: Candidate ID not provided";
    }

    if (!candidateId || !newPass) {
        throw "PASSWORD ERROR: Not enough arguments given to update function";
    }
    const candidateCollection = await candidates();
    let updatedCandidate = {password: newPass};

    const updated = await candidateCollection.updateOne({ _id: new ObjectID(candidateId) }, {$set: updatedCandidate});
    if (updated.result.ok !== 1) {
        throw "ERROR: There was an error updating the employer";
    }
};  

/**
* Update the given skill of a candidate
* @param candidateId The id for the candidate to be updated
* @param newSkills The new skills for the requested candidate
* @return none Throws an error if the candidate skills were not added
*/
const updateSkills = async(candidateId, newSkills) => {
    if (!candidateId) {
        throw "ERROR: Candidate ID not provided";
    }

    if(!Array.isArray(newSkills)) {
        throw "Invalid skills";
    }

    for(let i = 0; i < newSkills.length; i++) {
        if(!validSkill(newSkills[i])) {
            throw "Invalid skill"
        }
    }

    const candidateCollection = await candidates();
    let updatedCandidate = {skills: newSkills};
       
    const updated = await candidateCollection.updateOne({ _id: new ObjectID(candidateId) }, {$set: updatedCandidate});
    if (updated.result.ok !== 1) {
        throw "ERROR: There was an error updating the candidate";
    }
};


/**
* Add the given experiences to a candidate
* @param candidateId The id for the candidate to be updated
* @param newExp The new experiences for the requested candidate
* @return none Throws an error if the candidate experiences were not added
*/
const updateExp = async(candidateId, newExp) => {
    if (!candidateId) {
        throw "ERROR: Candidate ID not provided";
    }

    if(!Array.isArray(newExp)) {
        throw "Invalid experiences";
    }

    for(let i = 0; i < newExp.length; i++) {
        if(!validExperience(newExp[i])) {
            throw "Invalid experience"
        }
    }

    const candidateCollection = await candidates();
    let updatedCandidate = {experience: newExp};
       
    const updated = await candidateCollection.updateOne({ _id: new ObjectID(candidateId) }, {$set: updatedCandidate});
    if (updated.result.ok !== 1) {
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
        throw "IMG ERROR: Not enough arguments given to update function";
    }
    const candidateCollection = await candidates();
    let updatedCandidate = {profileImage: newImg};

    const updated = await candidateCollection.updateOne({ _id: new ObjectID(candidateId) }, {$set: updatedCandidate});

    if (updated.result.ok !== 1) {
        throw "ERROR: There was an error updating the candidate";
    }
};

const updateLinks = async (candidateId, newLinks) => {
    if (!candidateId) {
        throw "LINKS ERROR: Not enough arguments given to update function";
    }

    if(!Array.isArray(newLinks)) {
        throw "Invalid links";
    }

    for(let i = 0; i < newLinks.length; i++) {
        if(!validLink(newLinks[i])) {
            throw "Invalid link"
        }
    }

    const candidateCollection = await candidates();
    let updatedCandidate = {links: newLinks};

    const updated = await candidateCollection.updateOne({ _id: new ObjectID(candidateId) }, {$set: updatedCandidate});

    if (updated.result.ok !== 1) {
        throw "ERROR: There was an error updating the candidate";
    }
}

module.exports = {
    getAllCandidates,
    candidateSearch,
	getCandidateById,
	addCandidate,
	getCandidateByEmail,
    updateCandidateName,
    updateCandidateBio,
    updateCandidatePassword,
    updateCandidateImg,
    updateSkills,
    updateExp,
    updateLinks
};