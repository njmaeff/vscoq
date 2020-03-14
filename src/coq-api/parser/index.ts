export interface Token extends Location {
    type: TOKEN_TYPES
    token: string,
    src: string
}

export const lines = (str) => {
    const split = str.split('\n');
    const length = split.length
    const lastLine = split.slice(-1)[0]

    if (length > 1) {
        return {
            lines: length,
            lastLine,
            split
        };
    } else {
        return {
            lines: 1,
            lastLine,
            split
        }
    }
};

export const trimLeft = (str) => {
    let test = /^\s+/;
    let matches = test.exec(str)?.[0] ?? '';
    let newLines = lines(matches);
    let length = matches.length
    return {
        length,
        row: newLines.lines - 1,
        column: newLines.lastLine.length,
        src: str.slice(length)
    }
};

interface TokenTest {
    type: TOKEN_TYPES,
    exp: RegExp
}

type TOKEN_TYPES = 'identifier'
    | 'colon'
    | 'define'
    | 'stop'
    | 'pipe'
    | 'arrow'
    | 'openParen'
    | 'closeParen'
    | 'openCurlyBrace'
    | 'closeCurlyBrace'

export const IDENTIFIER = /^\w+\b/;
export const COLON = /^:/
export const DEFINE = /^:=/
export const STOP = /^\./
export const PIPE = /^\|/
export const ARROW = /^->/
export const OPEN_PAREN = /^\(/
export const CLOSE_PAREN = /^\)/
export const OPEN_CURLYBRACE = /^{/
export const CLOSE_CURLYBRACE = /^}/

export const matches: TokenTest[] = [
    {
        type: 'identifier',
        exp: IDENTIFIER
    },
    {
        type: 'colon',
        exp: COLON
    },
    {
        type: 'define',
        exp: DEFINE
    },
    {
        type: 'stop',
        exp: STOP
    },
    {
        type: 'pipe',
        exp: PIPE
    },
    {
        type: 'arrow',
        exp: ARROW
    },
    {
        type: 'openParen',
        exp: OPEN_PAREN
    },
    {
        type: 'closeParen',
        exp: CLOSE_PAREN
    },
    {
        type: 'openCurlyBrace',
        exp: OPEN_CURLYBRACE
    },
    {
        type: 'closeCurlyBrace',
        exp: CLOSE_CURLYBRACE
    },
]

export function Lexer(str) {
    let src = str;
    let column = 0;
    let row = 0

    return {
        getToken(): Token {
            let ws = trimLeft(src);
            src = ws.src
            column += ws.column
            row += ws.row

            let results = [];
            for (const test of matches) {
                const match = test.exp.exec(src)?.[0];
                if (match) {
                    results.push({
                        type: test.type,
                        match
                    });
                }
            }

            if (results.length === 1) {
                const [result] = results;
                const rawToken = result.match;
                const newLines = lines(rawToken);
                const stopColumn = column + newLines.lastLine.length
                const stopRow = row + newLines.lines - 1
                src = src.slice(rawToken.length);
                let token = {
                    type: result.type,
                    token: rawToken,
                    start: {row, column},
                    stop: {row: stopRow, column: stopColumn},
                    src
                }
                column = stopColumn
                row = stopRow;

                return token
            } else {
                throw new Error(`unable to match token...`);
            }

        },
    }
}

interface NodeTypes {
    type: 'inductive'
        | 'program'
        | 'definition'
        | 'arguments'
        | 'identifier'
        | 'returnType'
        | 'generic'
}

export function Stack<T extends Node>(...init) {
    const stack: T[] = init;
    return {
        get size() {
            return stack.length;
        },
        peek() {
            return stack.slice(-1)[0];
        },
        push(value) {
            stack.push(value)
        },
        pop() {
            return stack.pop();
        },
        find(type: NodeTypes['type']) {
            return stack.filter((el) => el.type === type);
        },
        index(int: number) {
            return stack[int];
        }
    }
}

export function Inductive({start, stop}): Node {
    return {
        start,
        stop,
        type: 'inductive',
    } as InductiveNode
}

interface Position {
    row: number
    column: number
}

interface Location {
    start: Position
    stop: Position
}

interface ProgramNode extends NodeTypes, Location {
    type: 'program'
    statements: Node[]
}

interface IdentifierNode extends NodeTypes, Location {

    type: 'identifier'
}

interface ReturnTypeNode extends NodeTypes, Location {
    type: 'returnType'
}

interface GenericNode extends NodeTypes, Location{
    type: 'generic'
}

interface InductiveNode extends NodeTypes, Location {
    type: 'inductive'
    identifier: IdentifierNode
    generic: GenericNode
    returns: ReturnTypeNode
}

type Node = ProgramNode | InductiveNode | IdentifierNode | ReturnTypeNode

export function Parser() {

    let ast: ProgramNode = {
        type: 'program',
        start: {row: 0, column: 0},
        statements: [],
    } as any;

    return {
        parse(str) {
            let lexer = Lexer(str)
            let remaining = str;
            let context = Stack<Node>(ast);

            while (remaining.length > 0) {
                const tokenData = lexer.getToken();
                switch (tokenData.type as TOKEN_TYPES) {
                    case "identifier":
                        let parent = context.peek();
                        if (parent.type === "program") {
                            if (tokenData.token === 'Inductive') {
                                let node = Inductive(tokenData)
                                parent.statements.push(node);
                                context.push(node);
                            }
                        }

                        if (parent.type === "inductive") {
                            parent.name = tokenData.token
                        }
                        break;
                }

                remaining = tokenData.src;
            }

            return {
                ast
            };
        },
    }

}
