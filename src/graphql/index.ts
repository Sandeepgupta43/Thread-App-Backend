import { ApolloServer } from "@apollo/server";
import { User } from "../Model/User";
import { UserGraphQl } from "./user";

async function createApolloGraphQLServer() {
    const gqlServer = new ApolloServer({
        typeDefs: `
                type Query {
                    hello:String
                }
                type Mutation {
                    ${UserGraphQl.mutations}
                }
            `,
        resolvers: {
            Query: {
                ...UserGraphQl.resolvers.queries
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