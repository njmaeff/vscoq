import Docker from "dockerode"
interface InstallOpts {
    host?: string
    socketPath?: string
    projectID?: string
}

export async function install(opts: InstallOpts) {
    let {env} = process
    const host = opts.host ?? env.DOCKER_HOST;

    let docker: Docker;
    if (host) {
        docker = new Docker({
            host
        });
    } else {
        docker = new Docker({
            host: 'localhost',
            socketPath: opts.socketPath ?? '/var/run/docker.sock'
        })
    }

    let network = await docker.createNetwork({
            "CheckDuplicate": true,
            "Driver": "bridge",
            "Name": `me.jmaeff.coq-api-${opts.projectID ?? 'default'}`
        }
    )

    const container = await docker.getContainer(env.HOSTNAME);
}
