import * as ast from "../parsing/ast-types";
import * as vscode from "vscode-languageserver";
import * as textUtil from "../util/text-util";
import * as parser from "../parsing/coq-parser";
import {ScopeDeclaration, Symbol, SymbolKind} from "./Scopes";

function identToSymbol(ident: ast.Identifier, kind: SymbolKind, pos: vscode.Position): Symbol {
    return {
        identifier: ident.text,
        kind: kind,
        range: textUtil.rangeTranslateRelative(pos, parser.locationRangeToRange(ident.loc))
    };
}

export function definition<S extends { prev: S, next: S, getScope(): ScopeDeclaration<S> | null }>(ast: ast.SDefinition, sent: S, pos: vscode.Position): ScopeDeclaration<S> {
    const result = new ScopeDeclaration(sent, [], null);
    result.addExportSymbol(identToSymbol(ast.ident, SymbolKind.Definition, pos));
    return result;
}

export function inductive<S extends { prev: S, next: S, getScope(): ScopeDeclaration<S> | null }>(ast: ast.SInductive, sent: S, pos: vscode.Position): ScopeDeclaration<S> {
    const result = new ScopeDeclaration(sent, [], null);
    ast.bodies.forEach(body => {
        result.addExportSymbol(identToSymbol(body.ident, SymbolKind.Inductive, pos));
        body.constructors.forEach(c => {
            result.addExportSymbol(identToSymbol(c.ident, SymbolKind.Constructor, pos));
        });
    });
    return result;
}

export function ltacDef<S extends { prev: S, next: S, getScope(): ScopeDeclaration<S> | null }>(ast: ast.SLtacDef, sent: S, pos: vscode.Position): ScopeDeclaration<S> {
    const result = new ScopeDeclaration(sent, [], null);
    result.addExportSymbol(identToSymbol(ast.ident, SymbolKind.Ltac, pos));
    return result;
}

export function assumptions<S extends { prev: S, next: S, getScope(): ScopeDeclaration<S> | null }>(ast: ast.SAssumptions, sent: S, pos: vscode.Position): ScopeDeclaration<S> {
    const result = new ScopeDeclaration(sent, [], null);
    ast.idents.forEach(a => {
        result.addLocalSymbol(identToSymbol(a, SymbolKind.Assumption, pos));
    });
    return result;
}

export function section<S extends { prev: S, next: S, getScope(): ScopeDeclaration<S> | null }>(ast: ast.SSection, sent: S, pos: vscode.Position): ScopeDeclaration<S> {
    const result = new ScopeDeclaration(sent, [], {kind: "begin", name: ast.ident.text, exports: true});
    return result;
}

export function module<S extends { prev: S, next: S, getScope(): ScopeDeclaration<S> | null }>(ast: ast.SModule, sent: S, pos: vscode.Position): ScopeDeclaration<S> {
    const result = new ScopeDeclaration(sent, [ast.ident.text], {
        kind: "begin",
        name: ast.ident.text,
        exports: ast.intro === "Export"
    });
    result.addExportSymbol(identToSymbol(ast.ident, SymbolKind.Module, pos));
    //  [ ast.ident, ...Array.prototype.concat(...ast.bindings.map((b) => b.idents)) ]
    //   .map((id) => identToSymbol(id, vscode.SymbolKind.Module, pos))
    return result;
}

export function moduleType<S extends { prev: S, next: S, getScope(): ScopeDeclaration<S> | null }>(ast: ast.SModuleType, sent: S, pos: vscode.Position): ScopeDeclaration<S> {
    const result = new ScopeDeclaration(sent, [ast.ident.text], {
        kind: "begin",
        name: ast.ident.text,
        exports: false
    });
    result.addExportSymbol(identToSymbol(ast.ident, SymbolKind.Module, pos));
    return result;
    // return [ ast.ident, ...Array.prototype.concat(...ast.bindings.map((b) => b.idents)) ]
    //   .map((id) => identToSymbol(id, vscode.SymbolKind.Module, pos))
}

export function moduleBind<S extends { prev: S, next: S, getScope(): ScopeDeclaration<S> | null }>(ast: ast.SModuleBind, sent: S, pos: vscode.Position): ScopeDeclaration<S> {
    const result = new ScopeDeclaration(sent, [], null);
    result.addExportSymbol(identToSymbol(ast.ident, SymbolKind.Module, pos));
    return result;
}

export function moduleTypeBind<S extends { prev: S, next: S, getScope(): ScopeDeclaration<S> | null }>(ast: ast.SModuleTypeBind, sent: S, pos: vscode.Position): ScopeDeclaration<S> {
    const result = new ScopeDeclaration(sent, [], null);
    result.addExportSymbol(identToSymbol(ast.ident, SymbolKind.Module, pos));
    return result;
}
