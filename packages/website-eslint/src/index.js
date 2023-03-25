// @ts-check

import eslintJs from '@eslint/js';
import * as plugin from '@typescript-eslint/eslint-plugin';
import { analyze } from '@typescript-eslint/scope-manager';
import { astConverter } from '@typescript-eslint/typescript-estree/use-at-your-own-risk';
import { visitorKeys } from '@typescript-eslint/visitor-keys';
import { Linter } from 'eslint';
import esquery from 'esquery';

// don't change exports to export *
exports.analyze = analyze;
exports.visitorKeys = visitorKeys;
exports.astConverter = astConverter;
exports.esquery = esquery;
exports.Linter = Linter;
exports.rules = plugin.rules;

/** @type {Record<string, unknown>} */
const configs = {};

for (const [key, value] of Object.entries(eslintJs.configs)) {
  configs[`eslint:${key}`] = value;
}
for (const [key, value] of Object.entries(plugin.configs)) {
  configs[`plugin:@typescript-eslint/${key}`] = value;
}

exports.configs = configs;
