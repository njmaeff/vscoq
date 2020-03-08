import path from "path";
import readPkgUp from "read-pkg-up";
import fs from "fs-extra";


export function getPkgRoot(starting?)
{
    return path.join(
        path.dirname(
            readPkgUp.sync({
                cwd: path.join(
                    starting || module.parent.filename
                )
            }).path
        ));
}

export const JsonType = (baseDir = 'json-types') => {
    let root = getPkgRoot(module.parent.filename)
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
    let root = path.dirname(module.parent.filename);
    let baseDirFullPath = path.join(root, baseDir);

    return (name: string, data: any) => {
        fs.ensureDirSync(baseDirFullPath);
        let filename = path.join(baseDirFullPath, `${name}.gen.json`)
        if (fs.pathExistsSync(filename)) {
            const fixture = require(filename);
            Object.assign(fixture, data)
        }
        fs.writeJSONSync(
            path.join(baseDirFullPath, `${name}.gen.json`),
            data,
            {spaces: 2}
        );
    }
}
export const extendTimeout = () => jest.setTimeout(60 * 60 * 60);
