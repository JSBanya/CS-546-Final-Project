const mongoCollections = require("./collections");
const candidates = mongoCollections.candidates;
const uuid = require("uuid");

const getAllCandidates = async () => {

}

const getCandidateById = async () => {

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

const removeCandidate = async () => {

}

const updateCandidate = async () => {

}

module.exports = {
	getAllCandidates,
	getCandidateById,
	addCandidate,
	removeCandidate,
	updateCandidate
};
