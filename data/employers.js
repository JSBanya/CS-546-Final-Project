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

const removeEmployer = async () => {

}

const updateEmployer = async () => {

}

module.exports = {
	getAllEmployers,
	getEmployerById,
	addEmployer,
	removeEmployer,
	updateEmployer
};
