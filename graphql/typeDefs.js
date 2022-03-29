const { gql } = require('apollo-server');

module.exports = gql`
    type Subscription {
        numberIncremented: Int!
    }
    type Post{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }
    type Comment{
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }
    type Like{
        id: ID!
        createdAt: String!
        username: String!
    }
    type User{
        id: ID!
        username: String!
        email: String!
        token: String!
        createdAt: String!
    }
    type Message{
        text: String!
        createdBy: String!
    }
    type DirectMessage{
        id: ID!
        content: String!
        from: String!
        to: String!
        createdAt: String!
    }
    type Conversation{
        id: ID!
        user1: String!
        user2: String!
        lastMessageDate: String!
        messages: [DirectMessage]!
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    input MessageInput {
        text: String!
        username: String!
    }
    input DirectMessageInput {
        content: String!
        from: String!
        to: String! 
    }
    type Query{
        getPosts: [Post]
        getPost(postId: ID!): Post
        message(id: ID!): Message
        getConversations(username: String!): [Conversation]
        getConversation(conversationId: ID!): Conversation
    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
        createMessage(messageInput: MessageInput): Message!
        createDirectMessage(conversationId: ID!, directMessageInput: DirectMessageInput): Conversation!
        deleteDirectMessage(conversationId: ID!, directMessageId: ID!): String!
        createConversation(directMessageInput: DirectMessageInput): Conversation!
        deleteConversation(conversationId: ID!): String!
    }
    type Subscription {
        messageCreated: Message
        conversationUpdated: Conversation
    }
`;