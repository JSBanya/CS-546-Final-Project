const mongoCollections = require("../data/collections");
const employers = mongoCollections.employers;

/**
 * Grabs all employers in the collection
 * (I do not see a use case for this but I'll keep it anyway)
 * @return employers A list of all the employer objects in the collection
 */
const getAllEmployers = async() => {
    const employersCollection = await employers();
    const employersList = await employersCollection.find({}).toArray();
    if(!employersList) {
        throw "ERROR: employers collection may not exist";
    }
    return employersList;
}

/**
 * Grabs the employer with the given employer id
 * @param employerId The id of the requested employer
 * @return employer The employer matching the given id
 */
const getEmployerById = async (id) => {
	const employersCollection = await employers();
	const result = await employersCollection.findOne({ "id": id });
    if (result === null || result === undefined) {
    	throw "No employer for given id";
    }

    return result;
}

/**
 * Grabs the employer with the given email
 * @param email The email for the requesting employer
 * @return employer The requested employer matching the given email
 */
const getEmployerByEmail = async (email) => {
    if (!email) {
        throw "ERROR: No email provided";
    }

    const employersCollection = await employers();
    const employer = await employersCollection.findOne({ "email": email });
    if (!employer) {
        throw "ERROR: No employer for given email";
    }

    return employer;
}

/**
 * Adds an employer of the given profile object
 * @param profile The profile object for the new employer
 * @return none Throws an error if the employer was not created
 */
const addEmployer = async(employer) => {
    if (!employer) {
        throw "ERROR: No profile provided";
    }

    const employersCollection = await employers();
    const info = await employersCollection.insertOne(employer);
    if(info.insertedCount === 0) {
        throw "ERROR: Unable to add employer to DB";
    }
};

/**
 * Removes the employer by the given employer id
 * @param employerId The id of the employer to remove
 * @return none Throws an error if the employer was not removed
 */
const removeEmployer = async(employerId) => {
    if (!employerId) {
        throw "ERROR: No id provided";
    }
    const employersCollection = await employers();
    const employer = await employersCollection.findOne({ "id": employerId });
    const deletedEmployer = await employersCollection.removeOne({ "id": employer.id });
    if (deletedEmployer.deletedCount === 0) {
        throw `Sorry, we could not find an employer with the id ${employerId}.`;
    }

    return employer;
};

/**
 * Update an employer name with the given employer id and name
 * @param employerId The given id for the employer to be updated
 * @param newName The new name for the employer
 * @return none Throws an error if the employer was not updated
 */
const updateEmployerName = async(employerId, newName) => {
    if (!employerId || !newName) {
        throw "ERROR: Not enough arguments given to update function";
    }
    const employersCollection = await employers();
    let updatedEmployer = {"name": newName};

    const updated = await employersCollection.updateOne({ "id": employerId }, {$set: updatedEmployer});

    if (!updated) {
        throw "ERROR: There was an error updating the employers";
    }
};

/**
 * Update an employer description with the given employer id and description
 * @param employerId The given id for the employer to be updated
 * @param newDesc The new description for the employer
 * @return none Throws an error if the employer was not updated
 */
const updateEmployerDesc = async(employerId, newDesc) => {
    if (!employerId || !newDesc) {
        throw "ERROR: Not enough arguments given to update function";
    }
    const employerCollection = await employers();
    let updatedEmployer = {"description": newDesc};

    const updated = await employerCollection.updateOne({ "id": employerId }, {$set: updatedEmployer});

    if (!updated) {
        throw "ERROR: There was an error updating the employer";
    }
};

/**
 * Update an employer image with the given employer id and image
 * @param employerId The given id for the employer to be updated
 * @param newImg The new image for the employer
 * @return none Throws an error if the employer was not updated
 */
const updateEmployerImg = async(employerId, newImg) => {
    if (!employerId || !newImg) {
        throw "ERROR: Not enough arguments given to update function";
    }
    const employerCollection = await employers();
    let updatedEmployer = {"profileImage": newImg};

    const updated = await employerCollection.updateOne({ "id": employerId }, {$set: updatedEmployer});

    if (!updated) {
        throw "ERROR: There was an error updating the employer";
    }
};  

module.exports = {
	getAllEmployers,
	getEmployerById,
	addEmployer,
	getEmployerByEmail,
	removeEmployer,
    updateEmployerName,
    updateEmployerDesc,
    updateEmployerImg
};