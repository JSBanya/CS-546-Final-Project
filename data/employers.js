const mongoCollections = require("../data/collections");
const employers = mongoCollections.employers;
const uuid = require("node-uuid");


    /**
     * Grabs all employers in the collection
     * (I do not see a use case for this but I'll keep it anyway)
     * @return employers A list of all the employer objects in the collection
     */
    const getAllEmployers = async() => {

    };

    /**
     * Grabs the employer with the given employer id
     * @param employerId The id of the requested employer
     * @return employer The employer matching the given id
     */
    const getEmployerById = async(employerId) => {

    };

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
        const employer = await employersCollection.findOne({ email: email });
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
    const addEmployer = async(profile) => {
        if (!profile) {
            throw "ERROR: No profile provided";
        }

        const employersCollection = await employers();
        const info = await employersCollection.insertOne(e);
        if(info.insertedCount === 0) {
            throw "ERROR: Unable to add candidate to DB";
        }
    };

    /**
     * Removes the employer by the given employer id
     * @param employerId The id of the employer to remove
     * @return none Throws an error if the employer was not removed
     */
    const removeEmployer = async(employerId) => {

    };

    /**
     * Update an employer name with the given employer id and name
     * @param employerId The given id for the employer to be updated
     * @param newName The new name for the employer
     * @return none Throws an error if the employer was not updated
     */
    const updateEmployerName = async(employerId, newName) => {

    };

    /**
     * Update an employer description with the given employer id and description
     * @param employerId The given id for the employer to be updated
     * @param newDesc The new description for the employer
     * @return none Throws an error if the employer was not updated
     */
    const updateEmployerDesc = async(employerId, newDesc) => {

    };

    /**
     * Update an employer image with the given employer id and image
     * @param employerId The given id for the employer to be updated
     * @param newImg The new image for the employer
     * @return none Throws an error if the employer was not updated
     */
    const updateEmployerImg = async(employerId, newImg) => {

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