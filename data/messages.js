const mongoCollections = require("../data/Collections");
const messages = mongoCollections.messages;
const uuid = require("node-uuid");

let exportedMethods = {
    /**
     * Messages Object Structure (stand-alone):
     *          { 
     *                  id,
     *                  senderId,
     *                  recieverId,
     *                  content
     *          }
     *
     * Message Object Structure (employer/candidate):
     *
     *          conversations: [ 
     *                          { 
     *                           candidateId/employerId,
     *                           messages: [ 
     *                                      {
     *                                       messageId,
     *                                       jobId
     *                                      },
     *                                      {
     *                                       messageId,
     *                                       jobId
     *                                      }
     *                                     ]
     *                          } 
     *                            ]
     *
     *
     */

    /**
     * Grabs all message in the collections
     * (I do not see a use case for this but I'll keep it anyway)
     * @return messages All messages in the collection
     */
    async getAllMessages() {

    },
    
    /**
     * Grabs all the conversations of an employer
     * @param employerId The id for the employer
     * @return conversations The conversations of an employer
     */
    async getAllEmployerConversations(employerId) {

    },

    /**
     * Grabs all the conversations of a candidate
     * @param candidateId The id for the requested candidate
     * @return conversations The conversations of a candidate
     */
    async getAllCandidateConversations(candidateId) {

    },

    /**
     * Adds a message of the given object to the given candidate
     * @param candidateId The candidate's id of the message
     * @param employerId The employer's id of the message
     * @param newMessage The new message object
     * @return sent True if the message was sent; False otherwise
     */
    async sendMessageToCand(candidateId, employerId, newMessage) {

    },

    /**
     * Adds a message of the given object to the given employer
     * @param candidateId The candidate's id of the message
     * @param employerId The employer's id of the message
     * @param newMessage The new message object
     * @return sent True if the message was sent; False otherwise
     */
    async sendMessageToEmpl(candidateId, employerId, newMessage) {

    },

    /**
     * Deletes a conversation with the given candidate and employer id 
     * (Only removes the conversation for the profile that requests the deletion)
     * @param condidateId The id of the message's candidate
     * @param employerId The id of the message's employer
     * @param whoDeleted A string indicating who is deleting the conversation ("candidate" | "employer")
     * @return deleted True is the conversation was deleted; False otherwise
     */
    async deleteConversation(candidateId, employerId, whoDeleted) {

    }
};

module.exports = exportedMethods;
