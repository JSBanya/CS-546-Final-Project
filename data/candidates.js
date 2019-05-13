const mongoCollections = require("./collections");
const candidates = mongoCollections.candidates;

const getAllCandidates = async () => {

}

const getCandidateById = async (id) => {
	const candidatesCollection = await candidates();
	const result = await candidatesCollection.findOne({ _id: id });
    if (result === null || result === undefined) {
    	throw "No candidate for given id";
    }

    return result;
}

// Create new Candidate
// Assumes candidate data has been checked for consistency and validity prior to invokation
const addCandidate = async (c) => {
	const candidatesCollection = await candidates();
	const info = await candidatesCollection.insertOne(c);
	if(info.insertedCount === 0) {
		throw "Unable to add candidate to DB";
	}
}

const getCandidateByEmail = async (email) => {
	const candidatesCollection = await candidates();
	const result = await candidatesCollection.findOne({ email: email });
    if (result === null || result === undefined) {
    	throw "No candidate for given email";
    }

    return result;
}

// Add or update session in candidate
const addCandidateSession = async (id, sessionid) => {
	const candidatesCollection = await candidates();
	const info = await candidatesCollection.updateOne({ _id: id }, { $set: { sessionID: sessionid }});
    if (info.modifiedCount === 0) {
      throw "Unable to update candidate session";
    }
}

const getCandidateBySession = async (sessionid) => {
	const candidatesCollection = await candidates();
	const result = await candidatesCollection.findOne({ sessionID: sessionid });
    if (result === null || result === undefined) {
    	throw "No candidate for given session";
    }

    return result;
}

const removeCandidate = async () => {

}

const updateCandidate = async () => {

}

module.exports = {
	getAllCandidates,
	getCandidateById,
	addCandidate,
	getCandidateByEmail,
	addCandidateSession,
	getCandidateBySession,
	removeCandidate,
	updateCandidate
};
