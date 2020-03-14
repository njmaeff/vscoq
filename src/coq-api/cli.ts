import program from "commander";
import * as api from "./index";

const exit = (e) =>
{
    console.error(e.shortMessage ?? e)
    process.exit(1);
};

export function main()
{
    program
        .command('install [host]', 'what host should we install the api server')
        .option('--socket-path', 'is there a special socket path?')
        .action(function(id, opts)
        {
            api.install(opts)
                .catch(exit);
        })

    if(process.argv.length === 2)
    {
        process.argv.push('--help')
    }
    program.parse(process.argv);
}
