import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { sequelize } from "./lib/db";
import createApolloGraphQLServer from "./graphql/index";
import "dotenv/config";

async function inti() {
    const app = express();
    const PORT = 8000;

    app.use(express.json());
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await sequelize.sync({ alter: true }); // or { force: true } for drop-and-create
    console.log("All models were synchronized.");

    // Create the apollo server

    app.get("/", (req, res) => {
        res.json({
            message: "hello",
        });
    });

    app.use("/graphql", expressMiddleware(await createApolloGraphQLServer()));
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}

inti();
