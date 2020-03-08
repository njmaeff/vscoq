import * as vscode from 'vscode-languageserver';
import * as server from '../server';
import * as parser from './coq-parser';
import * as path from 'path';
import * as fs from 'fs';
import * as parseAstSymbols from "./parseAstSymbols";

export abstract class SentenceSemantics {
  public abstract isEqual(x: SentenceSemantics) : boolean;
}

export class LoadModule implements SentenceSemantics {
  private sourceFile : string = undefined;
  public constructor(
    /** filename of *.vo file */
    private filename: string,
    private module: string,
  ) {
    const file = path.parse(this.filename);
    const source = path.join(file.dir, file.name + ".v");
    fs.exists(source, (fileExists) => {
      if(fileExists)
        this.sourceFile = "file://" + source;
    });
  }

  public getSourceFileName() : string {
    return this.sourceFile;
  }

  public getModuleName() : string {
    return this.module
  }

  public getModuleFileName() : string {
    return this.filename
  }

  public isEqual(x: SentenceSemantics) : boolean {
    return x instanceof LoadModule && x.filename === this.filename;
  }
}


export class Definition implements SentenceSemantics {
  public constructor(
    public readonly identifier: string,
    public readonly range: vscode.Range,
  ) {
  }

  public isEqual(x: SentenceSemantics) : boolean {
    return x instanceof Definition && x.identifier === this.identifier;
  }
}

export class Inductive implements SentenceSemantics {
  public constructor(
    public readonly identifier: string,
    public readonly range: vscode.Range,
  ) {
  }

  public isEqual(x: SentenceSemantics) : boolean {
    return x instanceof Inductive && x.identifier === this.identifier;
  }
}

// export function parseAst(ast: parser.Sentence, pos: vscode.Position) : SentenceSemantics[] {
//   switch(ast.type) {
//   case "definition": return parseAstDefinition(ast,pos);
//   case "inductive": return parseAstInductive(ast,pos);
//   default:
//     return []
//   }
// }


export function parseAstForSymbols(ast: parser.Sentence, pos: vscode.Position) : vscode.SymbolInformation[] {
  try {
    switch(ast.type) {
    case "assumptions": return parseAstSymbols.assumptions(ast,pos);
    case "definition": return parseAstSymbols.definition(ast,pos);
    case "inductive": return parseAstSymbols.inductive(ast,pos);
    case "ltacdef": return parseAstSymbols.ltacDef(ast,pos);
    case "section": return parseAstSymbols.section(ast,pos);
    case "module": return parseAstSymbols.module(ast,pos);
    case "module-bind": return parseAstSymbols.moduleBind(ast,pos);
    case "module-type": return parseAstSymbols.moduleType(ast,pos);
    case "module-type-bind": return parseAstSymbols.moduleTypeBind(ast,pos);
    default:
      return []
    }
  } catch(err) {
    if(err instanceof Error)
      server.connection.console.warn(`Error processing AST of type ${ast.type}: ` + err.message + '\n' + err.stack);
    else
      server.connection.console.warn(`Error processing AST of type ${ast.type}: ` + err.toString());
    return [];
  }
}
