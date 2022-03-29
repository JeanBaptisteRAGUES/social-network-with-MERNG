const { UserInputError, AuthenticationError } = require('apollo-server');
const { PubSub } = require("graphql-subscriptions");

const Conversation = require('../../models/Conversation');
const checkAuth = require('../../util/check-auth');

const pubsub = new PubSub();

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

            const newConversation = await Conversation.findById(conversationId);

            if(newConversation){
                newConversation.messages.unshift({
                    content,
                    from,
                    to,
                    createdAt: new Date().toISOString()
                })
                newConversation.lastMessageDate = new Date().toISOString();
                const conversation =  await newConversation.save();

                pubsub.publish('CONVERSATION_UPDATED', {
                    conversationUpdated: {
                        id: conversation.id,
                        user1: from,
                        user2: to,
                        lastMessageDate: new Date().toISOString(),
                        messages: conversation.messages
                    }
                });

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
    },
    Subscription: {
        conversationUpdated: {
            subscribe: () => pubsub.asyncIterator('CONVERSATION_UPDATED')
        }
    }
}