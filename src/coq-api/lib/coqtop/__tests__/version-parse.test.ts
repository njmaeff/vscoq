import version from "./__fixtures__/coqtop-version.gen.json"

export function parseVersion(str) {
    const pattern = /^\s*The Coq Proof Assistant, version (.+?)\s/
    const matches = pattern.exec(str);
    return matches.slice(1, 4).join('.') /*?+*/
}

test('parsing the version', () => {
    let expected = "8.10.2"
    let result = parseVersion(version.version)
    expect(result).toEqual(expected)
});
