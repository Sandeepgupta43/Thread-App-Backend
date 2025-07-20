import { ApolloServer } from "@apollo/server";
import { User } from "../Model/User";
import { UserGraphQl } from "./user";

async function createApolloGraphQLServer() {
    const gqlServer = new ApolloServer({
        typeDefs: `
            ${UserGraphQl.typeDefs}
            type Query {
                ${UserGraphQl.queries}
            }
            type Mutation {
                ${UserGraphQl.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...UserGraphQl.resolvers.queries,
                
            },
            Mutation: {
                ...UserGraphQl.resolvers.mutations
            },
        },
    });

    //start the apollo server
    await gqlServer.start();

    return gqlServer;
}


export default createApolloGraphQLServer;