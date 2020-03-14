import {Parser, trimLeft, ARROW, COLON, DEFINE, IDENTIFIER, PIPE, STOP} from "../"


describe('token tests', () =>
{
    test('identifier', () =>
    {
        let id = 'Inductive  '
        let match = IDENTIFIER.exec(id)?.[0];
        expect(match).toEqual('Inductive');
    });
    test('colon', () =>
    {
        let id = ':  '
        let match = COLON.exec(id)?.[0];
        expect(match).toEqual(':');
    });

    test('define', () =>
    {
        let id = ':=  '
        let match = DEFINE.exec(id)?.[0];
        expect(match).toEqual(':=');
    });
    test('stop', () =>
    {
        let id = '.  '
        let match = STOP.exec(id)?.[0];
        expect(match).toEqual('.');
    });

    test('pipe', () =>
    {
        let id = '|  '
        let match = PIPE.exec(id)?.[0];
        expect(match).toEqual('|');
    });

    test('arrow', () =>
    {
        let id = '->  '
        let match = ARROW.exec(id)?.[0];
        expect(match).toEqual('->');
    });

});


describe('trim left', () =>
{
    test('trim left', () =>
    {
        let str = `              \n\r                  \n    hello`
        let result = trimLeft(str);
        expect(result).toEqual({ column: 4, length: 39, row: 2, src: 'hello' });
    });

    test('no new space', () =>
    {
        let str = 'hello'
        let result = trimLeft(str);
        expect(result).toEqual({ column: 0, length: 0, row: 0, src: 'hello' })
    });

    test('one new line', () =>
    {
        let str = '\nhello'
        let result = trimLeft(str);
        expect(result).toEqual({ column: 0, length: 1, row: 1, src: 'hello' })
    });
});

describe('parser', () =>
{

    test('parse inductive type', () =>
    {
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

describe('babel examples', () =>
{

    test('babel ast', () =>
    {
        const parser = require('@babel/parser');
        let src = `const x = () => "hello"`
        let ast = parser.parse(src)

        expect(ast).toMatchSnapshot(src);
    });
});
