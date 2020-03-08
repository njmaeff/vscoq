import * as parser from "./coq-parser";
import * as vscode from "vscode-languageserver";
import * as textUtil from "../util/text-util";

function identToSymbol(ident: parser.Identifier, kind: vscode.SymbolKind, pos: vscode.Position): vscode.SymbolInformation {
    return vscode.SymbolInformation.create(ident.text, vscode.SymbolKind.Variable, textUtil.rangeTranslateRelative(pos, parser.locationRangeToRange(ident.loc)));
}

export function definition(ast: parser.SDefinition, pos: vscode.Position): vscode.SymbolInformation[] {
    return [identToSymbol(ast.ident, vscode.SymbolKind.Variable, pos)]
}

export function inductive(ast: parser.SInductive, pos: vscode.Position): vscode.SymbolInformation[] {
    return Array.prototype.concat(
        ...ast.bodies.map((indBody) =>
            [identToSymbol(indBody.ident, vscode.SymbolKind.Class, pos)
                , ...indBody.constructors
                .map((c) => identToSymbol(c.ident, vscode.SymbolKind.Constructor, pos))
            ])
    )
}

export function ltacDef(ast: parser.SLtacDef, pos: vscode.Position): vscode.SymbolInformation[] {
    return [identToSymbol(ast.ident, vscode.SymbolKind.Function, pos)]
}

export function assumptions(ast: parser.SAssumptions, pos: vscode.Position): vscode.SymbolInformation[] {
    return ast.idents.map((id) => identToSymbol(id, vscode.SymbolKind.Variable, pos))
}

export function section(ast: parser.SSection, pos: vscode.Position): vscode.SymbolInformation[] {
    return [identToSymbol(ast.ident, vscode.SymbolKind.Namespace, pos)]
}

export function module(ast: parser.SModule, pos: vscode.Position): vscode.SymbolInformation[] {
    return [ast.ident, ...Array.prototype.concat(...ast.bindings.map((b) => b.idents))]
        .map((id) => identToSymbol(id, vscode.SymbolKind.Module, pos))
}

export function moduleType(ast: parser.SModuleType, pos: vscode.Position): vscode.SymbolInformation[] {
    return [ast.ident, ...Array.prototype.concat(...ast.bindings.map((b) => b.idents))]
        .map((id) => identToSymbol(id, vscode.SymbolKind.Module, pos))
}

export function moduleBind(ast: parser.SModuleBind, pos: vscode.Position): vscode.SymbolInformation[] {
    return [identToSymbol(ast.ident, vscode.SymbolKind.Module, pos)]
}

export function moduleTypeBind(ast: parser.SModuleTypeBind, pos: vscode.Position): vscode.SymbolInformation[] {
    return [identToSymbol(ast.ident, vscode.SymbolKind.Module, pos)]
}
