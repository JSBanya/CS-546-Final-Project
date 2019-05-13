const mongoCollections = require("../data/collections");
const employers = mongoCollections.employers;
const uuid = require("uuid");

const getAllEmployers = async () => {

}

const getEmployerById = async () => {

}


// Create new Employer
// Assumes employer data has been checked for consistency and validity prior to invokation
const addEmployer = async (e) => {
	const employersCollection = await employers();
	const info = await employersCollection.insertOne(e);
	if(info.insertedCount === 0) {
		throw "Unable to add candidate to DB";
	}
}

const getEmployerByEmail = async (email) => {
	const employersCollection = await employers();
	const result = await employersCollection.findOne({ email: email });
    if (result === null || result === undefined) {
    	throw "No employer for given email";
    }

    return result;
}

// Add or update session in candidate
const addEmployerSession = async (id, sessionid) => {
	const employersCollection = await employers();
	const info = await employersCollection.updateOne({ _id: id }, { $set: { sessionID: sessionid }});
    if (info.modifiedCount === 0) {
      throw "Unable to update employer session";
    }
}

const getEmployerBySession = async (sessionid) => {
	const employersCollection = await employers();
	const result = await employersCollection.findOne({ sessionID: sessionid });
    if (result === null || result === undefined) {
    	throw "No employer for given session";
    }

    return result;
}
const removeEmployer = async () => {

}

const updateEmployer = async () => {

}

module.exports = {
	getAllEmployers,
	getEmployerById,
	addEmployer,
	getEmployerByEmail,
	addEmployerSession,
	getEmployerBySession,
	removeEmployer,
	updateEmployer
};
