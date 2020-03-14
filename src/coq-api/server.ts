import {ApolloServer} from "apollo-server";
import {importSchema} from "graphql-import";
import {Resolvers} from "./resolvers";

const typeDefs = importSchema('./types.graphql');

export interface CoqApiContext {
}

export interface CoqServerOpts {
    containerMode: boolean
}

export async function main(opts: CoqServerOpts = {containerMode: true}) {

    let server =  new ApolloServer({
        typeDefs,
        resolvers: await Resolvers(opts),
    });

    return {
        server,
        async run() {
            const {url} = await server.listen(4000);
            console.log(`🚀 Server ready at ${url}`);
        }
    }
}

if (!module.parent) {
    main()
        .then(({run}) => run())
        .catch((e) => {
            console.error(e);
            process.exit(1)
        });
}
