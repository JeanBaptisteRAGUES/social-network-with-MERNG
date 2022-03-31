const { AuthenticationError } = require('apollo-server');
const { PubSub } = require("graphql-subscriptions");

const Conversation = require('../../models/Conversation');
const checkAuth = require('../../util/check-auth');

const pubsub = new PubSub();

module.exports = {
    Query: {
        async getConversations(_, { username }, context){
            const user = checkAuth(context);
            try{
                let conversations = await Conversation.find().sort({ lastMessageDate: -1 });
                conversations = conversations.filter(c => c.user1 === username || c.user2 === username);
                return conversations;
            } catch(err) {
                throw new Error(err);
            }
        },
        async getConversation(_, { conversationId }){
            try{
                const conversation = await Conversation.findById(conversationId);
                if(conversation){
                    return conversation;
                }else{
                    throw new Error('Conversation not found');
                }
            } catch (err) {
                throw new Error('Erreur récupération de la conversation : ' + err);
            }
        }
    },
    Mutation: {
        async createConversation(_, { directMessageInput: {content, from, to} }, context){
            const user = checkAuth(context);
            
            if(content.trim() === ''){
                throw new Error('Direct message content must not be empty');
            }

            const newConversation = new Conversation({
                user1: from,
                user2: to,
                lastMessageDate: new Date().toISOString(),
                messages: [{
                    content,
                    from,
                    to,
                    createdAt: new Date().toISOString()
                }]
            });

            const conversation = await newConversation.save();

            pubsub.publish('CONVERSATION_CREATED', {
                conversationCreated: {
                    id: conversation.id,
                    user1: from,
                    user2: to,
                    lastMessageDate: new Date().toISOString(),
                    messages: [{
                        content,
                        from,
                        to,
                        createdAt: new Date().toISOString()
                    }]
                }
            });

            return conversation;
        },
        async deleteConversation(_, { conversationId }, context){
            const user = checkAuth(context);

            try {
                const conversation = await Conversation.findById(conversationId);
                if(user.username === conversation.user1 || user.username === conversation.user2) {
                    await conversation.delete();
                    return 'Conversation deleted sucessfully';
                }else{
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Subscription: {
        conversationCreated: {
            subscribe: () => pubsub.asyncIterator('CONVERSATION_CREATED')
        }
    }
}