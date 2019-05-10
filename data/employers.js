const mongoCollections = require("../data/ollections");
const employers = mongoCollections.employers;
const uuid = require("node-uuid");

let exportedMethods = {
    /**
     * Grabs all employers in the collection
     */
    async getAllEmployers() {

    }

    /**
     * Grabs the employer with the given id
     */
    async getEmployerById(id) {

    }

    /**
     * Adds an employer of the given profile object
     */
    async addEmployer(profile) {

    }

    /**
     * Removes the employer by the given id
     */
    async removeEmployer(id) {

    }

    /**
     * Update an employer with the given id and object
     */
    async updateEmployer(id, updatedEmployer) {

    }
};

module.exports = exportedMethods;
