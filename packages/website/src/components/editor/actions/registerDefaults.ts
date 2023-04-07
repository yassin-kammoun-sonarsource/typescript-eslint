import type * as Monaco from 'monaco-editor';

import {
  getEslintJsonSchema,
  getTypescriptJsonSchema,
} from '../../lib/jsonSchema';
import type { CreateLinter } from '../../linter/createLinter';
import type { PlaygroundSystem } from '../../linter/types';

export function registerDefaults(
  monaco: typeof Monaco,
  linter: CreateLinter,
  system: PlaygroundSystem,
): void {
  const eslintSchema = getEslintJsonSchema(linter);
  system.writeFile('/schema/eslint.schema', JSON.stringify(eslintSchema));
  const tsconfigSchema = getTypescriptJsonSchema();
  system.writeFile('/schema/tsconfig.schema', JSON.stringify(tsconfigSchema));

  // configure the JSON language support with schemas and schema associations
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [
      {
        uri: monaco.Uri.file('/schema/eslint.schema').toString(),
        fileMatch: ['.eslintrc'],
        schema: eslintSchema,
      },
      {
        uri: monaco.Uri.file('/schema/tsconfig.schema').toString(),
        fileMatch: ['tsconfig.json'],
        schema: tsconfigSchema,
      },
    ],
  });
}
