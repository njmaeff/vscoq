import Docker from "dockerode";
import {extendTimeout, Fixture, JsonType} from "@njmaeff/private-test";
import {StringStream} from "@njmaeff/coq-api/lib/stream";

extendTimeout();
let jsonType = JsonType();
let fixture = Fixture();
let docker = new Docker({socketPath: '/var/run/docker.sock'});

describe('static commands', () => {

    test('coqtop version', async () => {
        let str = StringStream();
        await docker.run(
            'coqorg/coq',
            ['coqtop', '--version'],
            str.stream,
            {HostConfig: {AutoRemove: true}}
        )
        fixture('coqtop-version', {version: str.output});
    });
});
