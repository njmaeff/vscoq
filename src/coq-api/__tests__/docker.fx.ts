import Docker from "dockerode";
import path from "path";
import fs from "fs-extra"
import readPkgUp from "read-pkg-up";
import {Writable} from "stream"
const {path: rootPackage} = readPkgUp.sync({cwd: __dirname});

export const JsonType = (baseDir = 'json-types') => {
    let root = path.dirname(rootPackage);
    let typeBaseDir = path.join(root, baseDir);

    return (name: string, data: any) => {
        fs.ensureDirSync(typeBaseDir);
        fs.writeJSONSync(
            path.join(typeBaseDir, `${name}.json`),
            data,
            {spaces: 2}
        );
    }
}

export const Fixture = (baseDir = '__fixtures__') => {
    let root = path.dirname(rootPackage);
    let baseDirFullPath = path.join(root, baseDir);

    return (name: string, data: any) => {
        fs.ensureDirSync(baseDirFullPath);
        let filename = path.join(baseDirFullPath, `${name}.json`)
        if (fs.pathExistsSync(filename)) {
            const fixture = require(filename);
            Object.assign(fixture, data)
        }
        fs.writeJSONSync(
            path.join(baseDirFullPath, `${name}.json`),
            data,
            {spaces: 2}
        );
    }
}

jest.setTimeout(60 * 60 * 60);

let jsonType = JsonType();
let fixture = Fixture();
let docker = new Docker({socketPath: '/var/run/docker.sock'});

describe('static commands', () => {

    test('coqtop version', async () => {
        let output = '';
        let stringStr = new Writable({
            write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
                output += chunk.toString();
                callback();
            }
        }).on("finish", () => {
                console.log(output)
            });

        await docker.run(
            'coqorg/coq',
            ['coqtop', '--version'],
            stringStr,
            {HostConfig: {AutoRemove: true}}
        )

        fixture('coqtop-version', {version: output});
    });
});
