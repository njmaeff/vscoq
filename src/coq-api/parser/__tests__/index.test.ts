import {Parser, trimLeft, TOKENS, Scanner, TOKEN_TYPES, ScannerType} from "../"


describe('token tests', () => {
    test('identifier', () => {
        let id = 'Inductive  '
        let match = TOKENS.identifier.exec(id)?.[0];
        expect(match).toEqual('Inductive');
    });
    test('colon', () => {
        let id = ':  '
        let match = TOKENS.colon.exec(id)?.[0];
        expect(match).toEqual(':');
    });

    test('define', () => {
        let id = ':=  '
        let match = TOKENS.define.exec(id)?.[0];
        expect(match).toEqual(':=');
    });
    test('stop', () => {
        let id = '.  '
        let match = TOKENS.stop.exec(id)?.[0];
        expect(match).toEqual('.');
    });

    test('pipe', () => {
        let id = '|  '
        let match = TOKENS.pipe.exec(id)?.[0];
        expect(match).toEqual('|');
    });

    test('arrow', () => {
        let id = '->  '
        let match = TOKENS.arrow.exec(id)?.[0];
        expect(match).toEqual('->');
    });

});

type ParseArgs = { scanner: ScannerType }

type Parse<T extends Node = Node> = ({scanner}: ParseArgs) => T

type MachineCall = (token: TOKEN_TYPES) => MachineCall;

describe.only('gen', () => {

    test('I*:T', () =>
    {

        const machineGen = <T = any>(exec: (token: TOKEN_TYPES, ctx: T) => boolean, init: TOKEN_TYPES, ctx): MachineCall => {
            if (init) {
                let state;
                let thunk = (token) => {
                    state = exec(token, ctx);
                    if (state) {
                        return thunk;
                    } else {
                        return false;
                    }
                }
                return thunk as any;
            } else {
                return false as any;
            }
        };

        const oneOrMoreTwo = machineGen((token, ctx) => {
            if (token === 'identifier' && ctx.count < ctx.limit) {
                ctx.count++;
                return true;
            } else {
                return false;
            }
        }, "identifier", {limit: Infinity, count: 0});

        oneOrMoreTwo('identifier')('identifier')('colon') /*?+*/

    });

});


describe.only('building inductive nodes', () => {

    function parseArguments({scanner}: ParseArgs) {
        let token = scanner.next();
        let result = [];
        let node = {};
        let A: [TOKEN_TYPES, number][] = [
            ['identifier', Infinity],
            ['colon', 1],
            ['identifier', 1],
        ]

        const endToken: TOKEN_TYPES = "colon";
        const context = [token]
        while (token.type !== endToken && context.length !== 0) {
            token = scanner.next();
            if (token.type === "openParen") {
                context.push(token);
            }

            if (token.type === "identifier") {

            }

            if (token.type === "closeParen") {
                context.pop();
            }


        }
    }

    function parseIdentifier({scanner}) {

        let token = scanner.next();
        if (token.type !== "identifier") {
            throw new Error(`token: ${token.token} is not a valid identifier`)
        }
        let node = {
            name: token.token,
            start: token.start
        };

        let next = scanner.peek();

        if (next.type === "colon") {
            return {node}
        } else if (next.type === "openParen") {

            return {node: parseArguments({scanner})}
        } else {
            throw new Error(`token: ${token.token} is not expected. After an identifier should be a generic definition or a colon`)
        }
    }

    test.only('single generic argument with parenthesis', () => {
        let src = 'list (A : Type) : Type'
        let scanner = Scanner(src);
        let result = parseIdentifier({scanner})
        expect(result.node).toEqual({})
    });
    test('more than one generic argument without parenthesis', () => {
        let src = 'list A B: Type : Type'
        throw new Error("not implemented yet")
    });

    test('more than one generic argument with one parenthesis', () => {
        let src = 'list (A B: Type) : Type'
        throw new Error("not implemented yet")
    });

    test('more than one generic argument with 2 parenthesis', () => {
        let src = 'list (A : Type) (B : Type) : Type'
        throw new Error("not implemented yet")
    });

    test('single generic argument without parenthesis', () => {
        let src1 = 'list A : Type : Type'
        throw new Error("not implemented yet")
    });

    test('non-generic identifier types', () => {

        function parseIdentifier({scanner}) {

        }

        let src = 'nat : Set'
    });

});

describe('trim left', () => {
    test('trim left', () => {
        let str = `              \n\r                  \n    hello`
        let result = trimLeft(str);
        expect(result).toEqual({column: 4, length: 39, row: 2, src: 'hello'});
    });

    test('no new space', () => {
        let str = 'hello'
        let result = trimLeft(str);
        expect(result).toEqual({column: 0, length: 0, row: 0, src: 'hello'})
    });

    test('one new line', () => {
        let str = '\nhello'
        let result = trimLeft(str);
        expect(result).toEqual({column: 0, length: 1, row: 1, src: 'hello'})
    });
});

describe('parser', () => {

    test('parse inductive type', () => {
        let parser = Parser();
        let src = `Inductive nat : Set :=\n    | 0 : nat\n    | S : nat -> nat.`;
        let result = parser.parse(src)

        expect(result.ast).toEqual({
            type: 'program',
            start: {row: 0, column: 0},
            end: {row: 0, column: 60},
            nodes: [
                {
                    type: 'inductive',
                    identifier: {
                        name: 'nat',
                        start: {row: 0, column: 10},
                        end: {row: 0, column: 13},
                    },
                    source: src,
                    returns: 'Set',
                    definition: [
                        {
                            identifier: '0',
                            type: 'nat',
                            start: {row: 1, column: 6},
                            end: {row: 1, column: 7}
                        },
                        {
                            identifier: 'S',
                            type: 'nat -> nat',
                            start: {row: 2, column: 6},
                            end: {row: 2, column: 7}
                        },
                    ],
                    start: {row: 0, column: 0},
                    end: {row: 0, column: 60},
                }
            ]

        })
    });

});

describe('babel examples', () => {

    test('babel ast', () => {
        const parser = require('@babel/parser');
        let src = `const x = () => "hello"`
        let ast = parser.parse(src)

        expect(ast).toMatchSnapshot(src);
    });
});
