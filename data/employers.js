const mongoCollections = require("../data/ollections");
const employers = mongoCollections.employers;
const uuid = require("node-uuid");

let exportedMethods = {
    /**
     * Grabs all employers in the collection
     * (I do not see a use case for this but I'll keep it anyway)
     * @return employers A list of all the employer objects in the collection
     */
    async getAllEmployers() {

    }

    /**
     * Grabs the employer with the given employer id
     * @param employerId The id of the requested employer
     * @return employer The employer matching the given id
     */
    async getEmployerById(employerId) {

    }

    /**
     * Adds an employer of the given profile object
     * @param profile The profile object for the new employer
     * @return added True if the employer was valid and added; False otherwise
     */
    async addEmployer(profile) {

    }

    /**
     * Removes the employer by the given employer id
     * @param employerId The id of the employer to remove
     * @return removed True if the employer was found and removed; False otherwise
     */
    async removeEmployer(employerId) {

    }

    /**
     * Update an employer name with the given employer id and name
     * @param employerId The given id for the employer to be updated
     * @param newName The new name for the employer
     * @return updated True if the employer was update; False otherwise
     */
    async updateEmployerName(employerId, newName) {

    }

    /**
     * Update an employer description with the given employer id and description
     * @param employerId The given id for the employer to be updated
     * @param newDesc The new description for the employer
     * @return updated True if the employer was update; False otherwise
     */
    async updateEmployerDesc(employerId, newDesc) {

    }

    /**
     * Update an employer image with the given employer id and image
     * @param employerId The given id for the employer to be updated
     * @param newImg The new image for the employer
     * @return updated True if the employer was update; False otherwise
     */
    async updateEmployerImg(employerId, newImg) {

    }

};

module.exports = exportedMethods;
