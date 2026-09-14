import express from "express";
import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import typeDefs from "./todoSchema";
import resolvers from "./todoResolver";
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    return res.json({ status: 200, message: "GraphQL API is running!" });
});
const main = async () => {
    const apollo = new ApolloServer({ typeDefs, resolvers });
    await apollo.start();
    app.use("/graphql", cors(), express.json(), expressMiddleware(apollo));
    app.listen(PORT, () => {
        console.log("Server is running at port : " + PORT);
        console.log("GraphQL playground at: http://localhost:" + PORT + "/graphql");
    });
};
main();
