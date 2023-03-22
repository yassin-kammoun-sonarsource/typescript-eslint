import type { TSESLint } from '@typescript-eslint/utils';

import type { ParseSettings } from './types';

export const defaultParseSettings: ParseSettings = {
  code: '',
  codeFullText: '',
  comment: true,
  comments: [],
  DEPRECATED__createDefaultProgram: false,
  debugLevel: new Set(),
  errorOnUnknownASTType: false,
  extraFileExtensions: [],
  filePath: '',
  jsx: true,
  loc: true,
  log: console.log,
  preserveNodeMaps: true,
  projects: [],
  range: true,
  tokens: [],
  tsconfigRootDir: '/',
  tsconfigMatchCache: new Map(),
  errorOnTypeScriptSyntacticAndSemanticIssues: false,
  EXPERIMENTAL_useSourceOfProjectReferenceRedirect: false,
  singleRun: false,
  programs: null,
  suppressDeprecatedPropertyWarnings: false,
  allowInvalidAST: false,
};

export const PARSER_NAME = '@typescript-eslint/parser';

export const defaultEslintConfig: TSESLint.Linter.Config = {
  parser: PARSER_NAME,
  parserOptions: {
    ecmaFeatures: {
      jsx: false,
      globalReturn: false,
    },
    ecmaVersion: 'latest',
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  rules: {},
};
