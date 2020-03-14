export function parseVersion(str) {
    const pattern = /^\s*The Coq Proof Assistant, version (.+?)\s/
    const matches = pattern.exec(str);
    return matches.slice(1, 4).join('.') /*?+*/
}
