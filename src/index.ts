import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { sequelize } from "./lib/db";
import { User } from "./Model/User";
import 'dotenv/config';

async function inti() {
    const app = express();
    const PORT = 8000;

    app.use(express.json());
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await sequelize.sync({ alter: true }); // or { force: true } for drop-and-create
    console.log("All models were synchronized.");

    // Create the apollo server

    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello:String
                say(name:String):String
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,
        resolvers: {
            Query: {
                hello: () => "hello from graphQL ",
                say: (_, { name }: { name: string }) => `Hey ${name}`,
            },
            Mutation: {
                createUser: async (
                    _,
                    {
                        firstName,
                        lastName,
                        email,
                        password,
                    }: {
                        firstName: String;
                        lastName: String;
                        email: string;
                        password: string;
                    }
                ) => {
                    await User.create({
                        email,
                        firstName,
                        lastName,
                        password,
                        salt: "random_salt",
                    });
                    return true;
                },
            },
        },
    });

    //start the apollo server
    await gqlServer.start();

    app.get("/", (req, res) => {
        res.json({
            message: "hello",
        });
    });

    app.use("/graphql", expressMiddleware(gqlServer));
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}

inti();
