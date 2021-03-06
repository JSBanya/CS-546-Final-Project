const mongoCollections = require("../data/collections");
const employers = mongoCollections.employers;
const ObjectID = require('mongodb').ObjectID;
const utils = require("./utils");

const validName = (name) => {
    if(utils.isEmpty(name) || !utils.isString(name)) {
        return false;
    }

    if(name.length > 50) {
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

const validDescription = (desc) => {
    if(!utils.isString(desc)) {
        return false;
    }

    if(desc.length > 500) {
        return false;
    }

    return true;
}

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
    if (!id) {
        throw "ERROR: Employer ID not provided";
    }

	const employersCollection = await employers();
	const result = await employersCollection.findOne({ _id: new ObjectID(id) });
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

    if(!validEmail(email)) {
        throw "invalid email";   
    }

    email = email.toLowerCase();

    const employersCollection = await employers();
    const employer = await employersCollection.findOne({ email: email });
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

    if(!validName(employer.name)) {
        throw "Invalid name"
    }

    if(!validEmail(employer.email)) {
        throw "Invalid email"
    }
    employer.email = employer.email.toLowerCase();


    if(!validDescription(employer.description)) {
        throw "Invalid description"
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
    const employer = await employersCollection.findOne({ _id: new ObjectID(employerId) });
    const deletedEmployer = await employersCollection.removeOne({ _id: employer.id });
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
    if (!employerId) {
        throw "ERROR: Not enough arguments given to update function";
    }

    if(!validName(newName)) {
        throw "Invalid name"
    }

    const employersCollection = await employers();
    let updatedEmployer = {name: newName};

    const updated = await employersCollection.updateOne({ _id: new ObjectID(employerId) }, {$set: updatedEmployer});

    if (updated.result.ok !== 1) {
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
    if (!employerId) {
        throw "ERROR: Not enough arguments given to update function";
    }

    if(!validDescription(newDesc)) {
        throw "Invalid description"
    }

    const employerCollection = await employers();
    let updatedEmployer = {description: newDesc};

    const updated = await employerCollection.updateOne({ _id: new ObjectID(employerId) }, {$set: updatedEmployer});

    if (updated.result.ok !== 1) {
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
    let updatedEmployer = {profileImage: newImg};

    const updated = await employerCollection.updateOne({ _id: new ObjectID(employerId) }, {$set: updatedEmployer});

    if (updated.result.ok !== 1) {
        throw "ERROR: There was an error updating the employer";
    }
};  

const updateEmployerPassword = async(employerId, newPass) => {
    if (!employerId || !newPass) {
        throw "ERROR: Not enough arguments given to update function";
    }
    const employerCollection = await employers();
    let updatedEmployer = {password: newPass};

    const updated = await employerCollection.updateOne({ _id: new ObjectID(employerId) }, {$set: updatedEmployer});
    if (updated.result.ok !== 1) {
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
    updateEmployerImg,
    updateEmployerPassword
};