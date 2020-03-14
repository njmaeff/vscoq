import {IResolvers as CoqResolvers} from "./graph-types";
import * as semver from "semver";
import {CoqApiContext, CoqServerOpts} from "./server";
import * as net from "net";
import Docker from "dockerode";
import {StringStream} from "@njmaeff/coq-api/lib/stream";
import {parseVersion} from "@njmaeff/coq-api/lib/coqtop/version-parse";
import xml from "xml2js"
import {Writable} from "stream"
import {EventEmitter} from "events"
import {createHttpTerminator} from "http-terminator";

interface CacheData {
    mainChannel
    controlChannel
    coqtopVersion: string
    container: Docker.Container
}

export const MainChannelServers = () => {
    let servers = {
        mainChannelRead: net.createServer().listen(),
        mainChannelWrite: net.createServer().listen()
    }
    let terminate: () => Promise<any> = () => {
        return Promise.all(
            [servers.mainChannelWrite, servers.mainChannelRead].map((server) => {
                return createHttpTerminator({server}).terminate()
            }));
    };
    return {
        servers,
        terminate,
        // @ts-ignore
        readPort: servers.mainChannelRead.address().port,
        // @ts-ignore
        writePort: servers.mainChannelWrite.address().port
    };


};

async function MainChannel(mainChannel: ReturnType<typeof MainChannelServers>) {

    let promises = [];
    for (const [id, server] of Object.entries(mainChannel.servers)) {
        promises.push(new Promise(resolve => server.once("connection", (socket) => resolve([id, socket]))))
    }

    let rawSockets: { [P in keyof typeof mainChannel.servers]: net.Socket } = {} as any
    for await (const [id, socket] of promises) {
        rawSockets[id] = socket;
    }

    let emitter = new EventEmitter()
    let inUse = false
    let response = ''
    const parser = new xml.Parser()

    rawSockets.mainChannelRead.pipe(new Writable({
        write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
            response += chunk;
            try {
                parser.parseString(response);
                emitter.emit('complete', response);
                response = '';
                inUse = false;
                callback();
            } catch (e) {
                console.log(e);
                callback();
            }
        }
    }));

    return {
        write: (xml) => {
            if (inUse) {
                throw new Error('server operation currently in progress...');
            }
            return new Promise(resolve => {
                emitter.once('complete', (response) => resolve(response));
                inUse = true;
                rawSockets.mainChannelWrite.write(xml);
            });
        },
        rawSockets,
        terminate: mainChannel.terminate
    }
}

export const Resolvers: (opts: CoqServerOpts) => Promise<CoqResolvers<CoqApiContext>> = async (opts) => {

    const {env} = process;
    let cache: Map<string, CacheData> = new Map();

    let docker = new Docker({
        socketPath: env['DOCKER_SOCKET_PATH'] ?? '/var/run/docker.sock',
        host: env['DOCKER_HOST'] ?? 'localhost'
    })

    let defaultNetwork = 'me.jmaeff.coq-api.network.default'
    let hostIP
    if (opts.containerMode) {
        let thisContainer = await docker.getContainer(env.HOSTNAME);
        hostIP = (await thisContainer.inspect()).NetworkSettings.Networks[defaultNetwork].IPAddress;
    } else {
        hostIP = "127.0.0.1"
    }


    return {
        Mutation: {
            coqTop: () => ({})
        },
        CoqTop: {
            init: async (parent, args) => {
                let cacheData: CacheData = cache.has(args.script) ? cache.get(args.script) : {} as any;
                let mainChannelServers = MainChannelServers();

                if (!cacheData.coqtopVersion) {
                    const str = StringStream();
                    await docker.run(
                        args.image,
                        ['coqtop', '--version'],
                        str.stream,
                        {HostConfig: {AutoRemove: true}}
                    );
                    cacheData.coqtopVersion = parseVersion(str.output);
                }

                let topfile: string[] = [];
                let coqTopArgs = [
                    '-main-channel', `${hostIP}:${mainChannelServers.readPort}:${mainChannelServers.writePort}`,
                    // '-control-channel', `${hostIP}:${listeners.controlChannelServerR.address().port}:${listeners.controlChannelServerW.address().port}`,
                    '-async-proofs', 'on'
                ]
                let coqtopModule = args.executable;

                if (semver.satisfies(cacheData.coqtopVersion, ">= 8.10")) {
                    topfile = ['-topfile', args.script];
                }
                if (semver.satisfies(cacheData.coqtopVersion, ">= 8.9")) {
                    coqTopArgs.concat(args.runArgs).concat(topfile);
                } else {
                    coqTopArgs.concat('-ideslave').concat(args.runArgs);
                }

                console.log('exec: ' + coqtopModule + ' ' + coqTopArgs.join(' '));

                let container = await docker.createContainer({
                    Cmd: [coqtopModule, ...coqTopArgs],
                    AttachStdout: true,
                    Image: args.image,
                    HostConfig: {
                        "NetworkMode": opts.containerMode ? defaultNetwork : 'host',
                        "AutoRemove": true,
                    },
                })
                await container.start()
                const mainChannel = await MainChannel(mainChannelServers)

                cacheData.container = container;
                cacheData.mainChannel = mainChannel
                cache.set(args.script, cacheData)
                return true
            },
            async destroy(parent, args) {
                const cacheData: CacheData = cache.get(args.script);
                try {
                    await cacheData.mainChannel.write(`<call val="Quit"> <unit/> </call>`);
                } catch (e) {
                    console.log(e);
                    await cacheData.container.stop()
                }

                await cacheData.mainChannel.terminate();
                cache.delete(args.script);
                return true;
            },
            async writeMainChannel(parent, args) {
                let cacheData = cache.get(args.script);
                let resp = await cacheData.mainChannel.write(args.xml);
                return true;
            }
        },
    };
}
