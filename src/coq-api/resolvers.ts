import {IResolvers as CoqResolvers} from "./graph-types";
import * as semver from "semver";
import {spawn} from "child_process";
import {CoqApiContext} from "./server";
import * as net from "net";
import Docker from "dockerode";
import merge from "lodash.merge"
export interface RunOpts {
    rm: boolean
    output
}

export function DockerAPI(docker: Docker) {

    return {
        run(image, cmd, opts: RunOpts): Promise<{data}> {
            const createOptions = {};
            if (opts.rm) {
                merge(createOptions, {HostConfig: {AutoRemove: true}})
            }
            return docker.run(image, cmd, opts.output ?? process.stdout, createOptions);
        }
    }
}


export const Resolvers: () => CoqResolvers<CoqApiContext> = () => {

    const {env} = process;
    let cache: Map<string, { version: string }> = new Map();
    let sockets = {
        mainChannelServer: net.createServer(),
        mainChannelServer2: net.createServer(),
        controlChannelServer: net.createServer(),
        controlChannelServer2: net.createServer()
    };
    let docker = new Docker({
        socketPath: env['DOCKER_SOCKET_PATH'] ?? '/var/run/docker.sock',
        host: env['DOCKER_HOST'] ?? 'localhost'
    })

    return {
        CoqTop: {
            init: async (parent, args, context) => {

                let coqTopVersion;
                if (!cache.has(args.image)) {
                    let {data} = await docker.run(
                        args.image,
                        ['--version'],
                        process.stdout,
                        {HostConfig:{AutoRemove: true}}
                    );

                } else {
                    coqTopVersion = cache.get(args.image).version
                }

                let topfile: string[] = [];
                let coqTopArgs = [
                    '-main-channel', mainAddr,
                    '-control-channel', controlAddr,
                    '-async-proofs', 'on'
                ]
                let coqtopModule = args.executable;

                if (semver.satisfies(coqTopVersion, ">= 8.10")) {
                    topfile = ['-topfile', args.script];
                }
                if (semver.satisfies(coqTopVersion, ">= 8.9")) {
                    coqTopArgs.concat(args.runArgs).concat(topfile);
                } else {
                    coqTopArgs.concat('-ideslave').concat(args.runArgs);
                }
                console.log('exec: ' + coqtopModule + ' ' + coqTopArgs.join(' '));
                let container = await docker.run(args.image,
                    [coqtopModule, 'coqtop', ...coqTopArgs],
                    process.stdout,

                    );
                // return spawn(coqtopModule, coqTopArgs, {detached: false, cwd: this.projectRoot});
            }
        }
    }
}
