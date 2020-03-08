import Docker from "dockerode";
import {Writable} from "stream"
import {Fixture, JsonType, extendTimeout} from "@njmaeff/private-test";

extendTimeout();
let jsonType = JsonType();
let fixture = Fixture();
let docker = new Docker({socketPath: '/var/run/docker.sock'});

export function StringStream() {
    let output = '';
    let stream = new Writable({
        write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
            output += chunk.toString();
            callback();
        }
    });

    return {
        stream,
        get output() {
            return output;
        },
    }
}

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
