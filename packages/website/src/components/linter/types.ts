import type { configs, rules } from '@typescript-eslint/eslint-plugin';
import type { analyze, ScopeManager } from '@typescript-eslint/scope-manager';
import type { astConverter } from '@typescript-eslint/typescript-estree/use-at-your-own-risk';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import type esquery from 'esquery';
import type * as ts from 'typescript';

export type { ParseSettings } from '@typescript-eslint/typescript-estree/use-at-your-own-risk';

export interface UpdateModel {
  storedAST?: TSESTree.Program;
  storedTsAST?: ts.Node;
  storedScope?: ScopeManager;
  typeChecker?: ts.TypeChecker;
}

export interface Disposable {
  dispose(): void;
}

export interface WebLinterModule {
  Linter: typeof TSESLint.Linter;
  analyze: typeof analyze;
  visitorKeys: TSESLint.SourceCode.VisitorKeys;
  astConverter: typeof astConverter;
  rules: typeof rules;
  configs: typeof configs;
  esquery: typeof esquery;
}
