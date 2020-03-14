import {createTestClient, ApolloServerTestClient} from "apollo-server-testing";
import * as server from "../server"
import {gql} from "apollo-boost";
import {extendTimeout} from "@njmaeff/private-test";

extendTimeout();

describe('server tests', () => {
    let client: ApolloServerTestClient;

    beforeAll(async () => {
        client = createTestClient(
            (
                await server.main({containerMode: false})
            ).server
        );
    });
    test('creating an image', async () => {
        await client.mutate({
            mutation: gql`
                mutation {
                    coqTop {
                        init(image: "coqorg/coq", executable: "coqidetop", script: "testing")
                    }
                }
            `
        })
        let result = await client.mutate({
            mutation: gql`
                mutation Init($xml: String){
                    coqTop {
                        writeMainChannel(script: "testing", xml: $xml)
                    }
                }
            `,
            variables: {
                xml: '<call val="Init"> <option val="none"/> </call>'
            }

        })

        await client.mutate({
            mutation: gql`
                mutation {
                    coqTop {
                        destroy(script: "testing")
                    }
                }
            `,
        })

        console.log(result);
    });
});
