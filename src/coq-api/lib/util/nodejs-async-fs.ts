import * as nfs from "fs";

export function open(path: string | Buffer, flags: string | number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        nfs.open(path, flags, (err: any, fd: number) => {
            if (err)
                reject(err)
            else
                resolve(fd);
        });
    })
}

export function writeFile(filename: string, data: any): Promise<void>;
export function writeFile(filename: string, data: any, options: { encoding?: string; mode?: number; flag?: string; }): Promise<void>;
export function writeFile(filename: string, data: any, options: { encoding?: string; mode?: string; flag?: string; }): Promise<void>;
export function writeFile(filename: string, data: any, options?: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        nfs.writeFile(filename, data, options, (err: NodeJS.ErrnoException) => {
            if (err)
                reject(err)
            else
                resolve();
        });
    })
}

export function readFile(filename: string, encoding: string): Promise<string>;
export function readFile(filename: string): Promise<Buffer>;
export function readFile(filename: string, options: { flag?: string }): Promise<Buffer>;
export function readFile(filename: string, options: { encoding: string, flag?: string }): Promise<string>;
export function readFile(filename: string, options?: string | { flag?: string }): Promise<Buffer | string> {
    return new Promise<Buffer | string>((resolve, reject) => {
        if (typeof options === "string") {
            nfs.readFile(filename, options, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        } else {
            nfs.readFile(filename, options, (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        }
    });
}

export function exists(path: string | Buffer): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        nfs.exists(path, (ex) => resolve(ex));
    });
}
