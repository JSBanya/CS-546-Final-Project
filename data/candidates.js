const mongoCollections = require("../data/collections");
const candidates = mongoCollections.candidates;
const uuid = require("node-uuid");

let exportedMethods = {
    /**
     * Grabs all candidates in the collection
     */
    async getAllCandidates() {

    }

    /**
     * Grabs the candidate with the given id
     */
    async getCandidateById(id) {

    }

    /**
     * Adds a candidate of the given profile object
     */
    async addCandidate(profile) {

    }

    /**
     * Removes a candidate by the given id
     */
    async removeCandidate(id) {

    }

    /**
     * Update a candidate with the given id and object
     */
    async updateCandidate(id, updatedCandidate) {

};

module.exports = exportedMethods;
