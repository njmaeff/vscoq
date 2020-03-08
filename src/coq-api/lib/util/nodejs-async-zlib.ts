import * as nzlib from 'zlib'


export function gunzip(data: Buffer, encoding = 'utf8'): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        nzlib.gunzip(data, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data.toString(encoding));
        });
    });
}
