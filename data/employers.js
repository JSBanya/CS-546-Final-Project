const mongoCollections = require("../data/collections");
const employers = mongoCollections.employers;
const uuid = require("uuid");

const getAllEmployers = async () => {

}

const getEmployerById = async (id) => {
	const employersCollection = await employers();
	const result = await employersCollection.findOne({ _id: id });
    if (result === null || result === undefined) {
    	throw "No candidate for given id";
    }

    return result;
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

const removeEmployer = async () => {

}

const updateEmployer = async () => {

}

module.exports = {
	getAllEmployers,
	getEmployerById,
	addEmployer,
	getEmployerByEmail,
	removeEmployer,
	updateEmployer
};
