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

export const TOKENS = {
    identifier: /^\w+\b/,
    colon: /^:/,
    define: /^:=/,
    stop: /^\./,
    pipe: /^\|/,
    arrow: /^\|/,
    openParen: /^\(/,
    closeParen: /^\)/,
    openCurlyBrace: /^{/,
    closeCurlyBrace: /^}/
}

export type TOKEN_TYPES = keyof typeof TOKENS

export const matches: TokenTest[] = Object.entries(TOKENS).map(
    ([type, exp]: [TOKEN_TYPES, RegExp]) => ({type, exp})
);

export function Tokenizer(src: string, matchers: TokenTest[], {trim}) {

    return {
        get() {

            let column = 0;
            let row = 0

            if (trim) {
                let ws = trim(src);
                src = ws.src
                column += ws.column
                row += ws.row
            }

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

            if (results.length > 1) {
                let longest = 0
                let duplicates = [];
                let length;
                let longestMatch;

                for (const id of results) {
                    length = id.match.length;

                    if (length === longest) {
                        duplicates.push(id);
                        continue
                    }

                    if (length > longest) {
                        longest = length
                        longestMatch = id;
                        duplicates = [longestMatch];
                    }
                }

                if (duplicates.length > 1) {
                    //todo(error): improve error message and provide context
                    throw new Error('ambiguous token...');
                } else {
                    results = [longestMatch]
                }

            }

            if (results.length === 1) {
                const [result] = results;
                const rawToken = result.match;
                const newLines = lines(rawToken);
                const stopColumn = column + newLines.lastLine.length;
                const stopRow = row + newLines.lines - 1;
                src = src.slice(rawToken.length);
                let token = {
                    type: result.type,
                    token: rawToken,
                    start: {row, column},
                    stop: {row: stopRow, column: stopColumn},
                    src
                };
                column = stopColumn;
                row = stopRow;
                return token;
            } else {
                throw new Error(`unable to match token...`);
            }
        },
    };
}

export interface ScannerType {
    peek(): Token;
    current(): Token;
    next(): Token;
}

export function Scanner(str): ScannerType {
    let next, current;
    const token = Tokenizer(str, matches, {trim: trimLeft});
    return {
        peek() {
            if (next) {
                return next;
            } else {
                next = token.get();
                return next;
            }
        },
        current() {
            return current;
        },
        next(): Token {
            if (next) {
                current = next;
                next = null
                return current;
            } else {
                current = token.get()
                next = null;
                return current;
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

interface StackType<T extends any> {
    size(): number;

    peek(): T;

    push(value: T): void;

    pop(): T;

    find(type: T['type']): T[];

    index(int: number): T;

    empty(): boolean

    clear(type?: 'init' | 'empty'): void
}

export function Stack<T extends any>(...init): StackType<T> {
    let stack: T[] = init;
    return {
        size() {
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
        find(type: T['type']) {
            return stack.filter((el) => el.type === type);
        },
        index(int: number) {
            return stack[int];
        },
        empty() {
            return stack.length === 0;
        },
        clear(type = 'init') {
            if (type === "init") {
                stack = init;
            } else {
                stack = [];
            }

        }
    }
}

interface InductiveOpts extends Partial<Location> {
    parent: ProgramNode
    lexer: ReturnType<typeof Scanner>
}

export function Inductive(opts: InductiveOpts) {
}

export function Program(): ProgramNode {
    let node = {
        type: 'program',
        start: {row: 0, column: 0},
        statements: [],
    } as ProgramNode
    node.context = Stack(node);
    return node

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
    context: StackType<Node>
}

interface IdentifierNode extends NodeTypes, Location {

    type: 'identifier'
    name: string
}

interface ReturnTypeNode extends NodeTypes, Location {
    type: 'returnType'
}

interface GenericNode extends NodeTypes, Location {
    type: 'generic'
}

interface InductiveNode extends NodeTypes, Location {
    type: 'inductive'
    identifier: IdentifierNode
    generic?: GenericNode
    returns?: ReturnTypeNode
    context: StackType<Node>
}

type Node = ProgramNode
    | InductiveNode
    | IdentifierNode
    | ReturnTypeNode

export function Identifier({start, stop, name}): IdentifierNode {
    return {
        type: "identifier",
        name,
        start,
        stop
    }
}

export function ReturnType(): ReturnTypeNode {

    return {
        type: "returnType"
    } as ReturnTypeNode
}


export const keyword = {
    inductive: (str) => str === 'Inductive'
}

export function Parser() {

    let ast = Program();

    return {
        parse(str) {
            let scanner = Scanner(str)
            let remaining = str;

            const structure = {}

            return {
                ast
            };
        },
    }

}
