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
        .description('which id should be built? the default id is "default"')
        .option('--dry-run', 'output config to console')
        .action(function(id, opts)
        {
            api.run(opts)
                .catch(exit);
        })

    if(process.argv.length === 2)
    {
        process.argv.push('--help')
    }
    program.parse(process.argv);
}
