const { UserInputError, AuthenticationError } = require('apollo-server');

const Conversation = require('../../models/Conversation');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Mutation: {
        createDirectMessage: async (_, { conversationId, directMessageInput: {content, from, to} }, context) => {
            const { username } = checkAuth(context);
            if(content.trim() === ''){
                throw new UserInputError('Empty message', {
                    errors: {
                        body: 'Direct messages content must not be empty'
                    }
                });
            }

            const conversation = await Conversation.findById(conversationId);

            if(conversation){
                conversation.messages.unshift({
                    content,
                    from,
                    to,
                    createdAt: new Date().toISOString()
                })
                conversation.lastMessageDate = new Date().toISOString();
                await conversation.save();
                return conversation;
            }else throw new UserInputError('Conversation not found');
        },
        async deleteDirectMessage(_, { conversationId, directMessageId }, context){
            const { username } = checkAuth(context);

            const conversation = await Conversation.findById(conversationId);

            if(conversation){
                const directMessageIndex = conversation.messages.findIndex(dm => dm.id === directMessageId);

                if(conversation.messages[directMessageIndex].from === username){
                    conversation.messages.splice(directMessageIndex, 1);
                    await conversation.save();
                    return conversation;
                } else {
                    throw new AuthenticationError('Action not allowed');
                } 
            } else {
                throw new UserInputError('Conversation not found');
            }
        }
    }
}