const mongoCollections = require("./collections");
const messages = mongoCollections.messages;
const uuid = require("node-uuid");


    /**
     * Messages Object Structure (stand-alone):
     *          { 
     *                  messageId,
     *                  senderId,
     *                  receiverId,
     *                  content
     *          }
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
        let messagesCollection = await messages();

        let message = {
            "id": uuid.v4(),
            "senderId": candidateId,
            "receiverId": employerId,
            "content": newMessage
        }

        let info = await messagesCollection.insertOne(message);
        if (info.insertedCount === 0) {
            throw "ERROR: Unable to add to messages collection";
        }
    };

    /**
     * Adds a message of the given object to the given employer
     * @param candidateId The candidate's id of the message
     * @param employerId The employer's id of the message
     * @param newMessage The new message object
     * @return none Throws an error if the message was not sent
     */
    const sendMessageToEmpl = async(candidateId, employerId, newMessage) => {
        let messagesCollection = await messages();

        let message = {
            "id": uuid.v4(),
            "senderId": employerId,
            "receiverId": candidateId,
            "content": newMessage
        }

        let info = await messagesCollection.insertOne(message);
        if (info.insertedCount === 0) {
            throw "ERROR: Unable to add to messages collection";
        }
    };

    /**
     * Deletes a conversation with the given candidate and employer id 
     * @param condidateId The id of the message's candidate
     * @param employerId The id of the message's employer
     * @return none Throws an error if the conversation was not deleted
     */
    const deleteConversation = async(candidateId, employerId) => {
        let messagesCollection = await messages();

        let info = await messagesCollection.removeOne({"senderId": employerId, "receiverId": candidateId});
        if (info.deleteCount === 0) {
            throw "ERROR: No messages to be deleted";
        }
    };

module.exports = {
    getAllMessages,
    getMessagesForCandidate,
    getMessagesForEmployer,
    sendMessageToCand,
    sendMessageToEmpl,
    deleteConversation
};
