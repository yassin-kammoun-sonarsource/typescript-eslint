import { toJson } from '../config/utils';
import versions from './packageVersions.json';
import type { ConfigFileType, ConfigModel, ConfigShowAst } from './types';

export const defaultConfig: ConfigModel = {
  ts: process.env.TS_VERSION!,
  sourceType: 'module',
  fileType: 'ts',
  showAST: false,
  tsconfig: toJson({
    compilerOptions: {
      strictNullChecks: true,
    },
  }),
  eslintrc: toJson({
    rules: {},
  }),
  code: `\n`,
};

export const tsVersions: string[] = [...versions.typescript];

if (!tsVersions.includes(process.env.TS_VERSION!)) {
  tsVersions.unshift(process.env.TS_VERSION!);
}

// export const esTsVersions: string[] = ['latest', ...versions.eslintPlugin];

export const detailTabs: { value: ConfigShowAst; label: string }[] = [
  { value: false, label: 'Errors' },
  { value: 'es', label: 'ESTree' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'scope', label: 'Scope' },
  { value: 'types', label: 'Types' },
];

export const fileTypes: ConfigFileType[] = [
  'ts',
  'tsx',
  'js',
  'jsx',
  'd.ts',
  'cjs',
  'mjs',
  'cts',
  'mts',
];
