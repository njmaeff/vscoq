import Docker from "dockerode";
import {extendTimeout, Fixture, JsonType} from "@njmaeff/private-test";

extendTimeout();
let jsonType = JsonType();
let fixture = Fixture();
let docker = new Docker({socketPath: '/var/run/docker.sock'});

describe('docker', () => {

    test('container info', async () => {

        let container = await docker.getContainer('fea518bb715d')
        let data = await container.inspect()
        jsonType('container-inspect', data)
        fixture('container-inspect', data)
    });

    test('create container', async () =>
    {
        let container = await docker.createContainer({
            Cmd: ['--help'],
            name: 'nj-temp',
            AttachStdout: true,
            Entrypoint: ['coqtop'],
            Image: 'coqorg/coq',
            HostConfig: {
                "NetworkMode": 'nj',
                "AutoRemove": true,
            },
        })
        await container.start()
    });
});
