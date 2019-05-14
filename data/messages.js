const mongoCollections = require("./collections");
const messages = mongoCollections.messages;

    /**
     * Messages Object Structure (stand-alone):
     *          { 
     *                  messageId,
     *                  senderId,
     *                  receiverId,
     *                  content,
     *                  title
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
        const messagesList = await messagesCollection.find({ senderId: employerId.toString() }).toArray();
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
        const messagesList = await messagesCollection.find({ receiverId: candidateId.toString() }).toArray();
        return messagesList;
    };

    /**
     * Adds a message of the given object to the given candidate
     * @param candidateId The candidate's id of the message
     * @param employerId The employer's id of the message
     * @param newMessage The new message text
     * @param title The new message's title
     * @return none Throws an error if the message was not sent
     */
    const sendMessageToCand = async(candidateId, employerId, newMessage, title) => {
        let messagesCollection = await messages();

        let message = {
            senderId: employerId,
            receiverId: candidateId,
            content: newMessage,
            title: title
        }

        let info = await messagesCollection.insertOne(message);
        if (info.insertedCount === 0) {
            throw "ERROR: Unable to add to messages collection";
        }
    };


module.exports = {
    getAllMessages,
    getMessagesForCandidate,
    getMessagesForEmployer,
    sendMessageToCand
};
