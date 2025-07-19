import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

async function inti() {
    const app = express();
    const PORT = 8000;

    app.use(express.json());
    
    // Create the apollo server
    
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello:String
                say(name:String):String
            }
        `,
        resolvers: {
            Query: {
                hello:() => "hello from graphQL ",
                say: (_,{name}:{name:string}) => `Hey ${name}`
            }
        },
    });
    
    //start the apollo server
    await gqlServer.start();
    
    app.get("/", (req, res) => {
        res.json({
            message: "hello",
        });
    });

    app.use('/graphql',expressMiddleware(gqlServer));
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}

inti();
