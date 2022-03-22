const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const express = require('express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

const PORT = process.env.PORT || 5000;

const schema = makeExecutableSchema({typeDefs, resolvers});

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),

        {
            async serverWillStart(){
                return {
                    async drainServer(){
                        await serverCleanup.dispose();
                    }
                }
            }
        }
    ],
    context: ({ req }) => ({req})
});

/*
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({req})
});
*/

server.start().then(() => {
    server.applyMiddleware({ app });

    mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log("MongoDB connected");
        //return server.listen({ port: PORT });
        httpServer.listen(PORT, () => {
            //console.log(`Server running at ${res.url}`);
            console.log(`Server is now running on http://localhost:${PORT}${server.graphqlPath}`);
        })
    })
    .catch(err => {
        console.error(err);
    });
});