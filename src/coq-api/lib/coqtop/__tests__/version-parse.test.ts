import version from "./__fixtures__/coqtop-version.gen.json"
import {parseVersion} from "../version-parse";

test('parsing the version', () => {
    let expected = "8.10.2"
    let result = parseVersion(version.version)
    expect(result).toEqual(expected)
});
