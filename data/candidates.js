const mongoCollections = require("./collections");
const candidates = mongoCollections.candidates;

const getAllCandidates = async () => {
	const candidatesCollection = await candidates();
    return await candidatesCollection.find({}).toArray();
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

const removeCandidate = async () => {

}

const updateCandidate = async () => {

}

module.exports = {
	getAllCandidates,
	getCandidateById,
	addCandidate,
	getCandidateByEmail,
	removeCandidate,
	updateCandidate
};
