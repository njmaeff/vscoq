import {ApolloServer} from "apollo-server";
import {importSchema} from "graphql-import";
import {Resolvers} from "./resolvers";
const typeDefs = importSchema('./types.graphql');

export interface CoqApiContext {
}

export interface CoqServerOpts {

}

export async function main(opts: CoqServerOpts = {}) {

    const server = new ApolloServer({
        typeDefs,
        resolvers: Resolvers(),
    });

    const {url} = await server.listen(4000);
    console.log(`🚀 Server ready at ${url}`);
}
