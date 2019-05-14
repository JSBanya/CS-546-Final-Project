const mongoCollections = require("./collections");
const messages = mongoCollections.messages;
const employerData = require("./employers");
const candidateData = require("./candidates");
const uuid = require("node-uuid");


    /**
     * Messages Object Structure (stand-alone):
     *          { 
     *                  id,
     *                  senderId,
     *                  receiverId,
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
    const getAllMessages = async() => {
        let messagesCollection = await messages();
        const messagesList = await messagesCollection.find({}).toArray();

        if (!messagesList) {
            throw "ERROR: Messages collection may not exist";
        }
        return messagesList;
    };
    
    /**
     * Grabs all the conversations of an employer
     * @param employerId The id for the employer
     * @return conversations The conversations of an employer
     */
    const getMessagesForEmployer = async(employerId) => {
        if (!employerId) {
            throw "ERROR: No employer id provided";
        }
        let messagesCollection = await messages();
        const messagesList = await messagesCollection.find({ "receiverId": employerId }).toArray();

        if (!messagesList) {
            throw "ERROR: Messages collection may not exist";
        }
        return messagesList;

    };

    /**
     * Grabs all the conversations of a candidate
     * @param candidateId The id for the requested candidate
     * @return conversations The conversations of a candidate
     */
    const getMessagesForCandidate = async(candidateId) => {
        if (!candidateId) {
            throw "ERROR: no candidate id provided";
        }
        let messagesCollection = await messages();
        const messagesList = await messagesCollection.find({ "receiverId": candidateId }).toArray();

        if (!messagesList) {
            throw "ERROR: Messages collection may not exist";
        }

        return messagesList;
    };

    /**
     * Adds a message of the given object to the given candidate
     * @param candidateId The candidate's id of the message
     * @param employerId The employer's id of the message
     * @param newMessage The new message object
     * @return none Throws an error if the message was not sent
     */
    const sendMessageToCand = async(candidateId, employerId, newMessage) => {
        
    };

    /**
     * Adds a message of the given object to the given employer
     * @param candidateId The candidate's id of the message
     * @param employerId The employer's id of the message
     * @param newMessage The new message object
     * @return none Throws an error if the message was not sent
     */
    const sendMessageToEmpl = async(candidateId, employerId, newMessage) => {

    };

    /**
     * Deletes a conversation with the given candidate and employer id 
     * (Only removes the conversation for the profile that requests the deletion)
     * @param condidateId The id of the message's candidate
     * @param employerId The id of the message's employer
     * @param whoDeleted A string indicating who is deleting the conversation ("candidate" | "employer")
     * @return none Throws an error if the conversation was not deleted
     */
    const deleteConversation = async(candidateId, employerId, whoDeleted) => {

    };

module.exports = {
    getAllMessages,
    getMessagesForCandidate,
    getMessagesForEmployer,
    sendMessageToCand,
    sendMessageToEmpl,
    deleteConversation
};
