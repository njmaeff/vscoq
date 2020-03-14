import {Writable} from "stream";

export function StringStream() {
    let output = '';
    let stream = new Writable({
        write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
            output += chunk.toString();
            callback();
        }
    });

    return {
        stream,
        get output() {
            return output;
        },
    }
}
