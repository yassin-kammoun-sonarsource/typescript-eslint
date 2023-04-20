import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema';

import type { CreateLinter } from '../linter/createLinter';

const defaultRuleSchema: JSONSchema4 = {
  type: ['string', 'number'],
  enum: ['off', 'warn', 'error', 0, 1, 2],
};

// https://github.com/microsoft/TypeScript/issues/17002
function isArray(arg: unknown): arg is readonly unknown[] {
  return Array.isArray(arg);
}

/**
 * Add the error level to the rule schema items
 *
 * if you encounter issues with rule schema validation you can check the schema by using the following code in the console:
 * monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas.find(item => item.uri.includes('typescript-eslint/consistent-type-imports'))
 * monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas.find(item => item.uri.includes('no-unused-labels'))
 * monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas.filter(item => item.schema.type === 'array')
 */
export function getRuleJsonSchemaWithErrorLevel(
  name: string,
  ruleSchema: JSONSchema4 | readonly JSONSchema4[],
): JSONSchema4 {
  const defaultSchema = { ...defaultRuleSchema };
  if (isArray(ruleSchema)) {
    if (ruleSchema[0]?.$defs) {
      defaultSchema.$defs = ruleSchema[0].$defs;
    }
    return {
      type: 'array',
      items: [defaultSchema, ...ruleSchema],
      minItems: 1,
      additionalItems: false,
    };
  }
  // example: explicit-member-accessibility
  if (isArray(ruleSchema.items)) {
    if (ruleSchema.items[0]?.$defs) {
      defaultSchema.$defs = ruleSchema.items[0].$defs;
    }
    return {
      ...ruleSchema,
      items: [defaultSchema, ...ruleSchema.items],
      maxItems: ruleSchema.maxItems ? ruleSchema.maxItems + 1 : undefined,
      minItems: ruleSchema.minItems ? ruleSchema.minItems + 1 : 1,
      additionalItems: false,
    };
  }
  // example: naming-convention rule
  if (typeof ruleSchema.items === 'object' && ruleSchema.items) {
    if (ruleSchema.items?.$defs) {
      defaultSchema.$defs = ruleSchema.items.$defs;
    }
    return {
      ...ruleSchema,
      items: [defaultSchema],
      additionalItems: ruleSchema.items,
    };
  }
  // example eqeqeq
  if (isArray(ruleSchema.anyOf)) {
    return {
      ...ruleSchema,
      anyOf: ruleSchema.anyOf.map(item =>
        getRuleJsonSchemaWithErrorLevel(name, item),
      ),
    };
  }
  // example logical-assignment-operators
  if (isArray(ruleSchema.oneOf)) {
    return {
      ...ruleSchema,
      oneOf: ruleSchema.oneOf.map(item =>
        getRuleJsonSchemaWithErrorLevel(name, item),
      ),
    };
  }
  if (typeof ruleSchema !== 'object' || Object.keys(ruleSchema).length) {
    console.error('unsupported rule schema', name, ruleSchema);
  }
  return {
    type: 'array',
    items: [defaultSchema],
    minItems: 1,
    additionalItems: false,
  };
}

/**
 * Get the JSON schema for the eslint config
 * Currently we only support the rules and extends
 */
export function getEslintJsonSchema(
  linter: CreateLinter,
  createRef: (name: string) => string,
): JSONSchema4 {
  const properties: Record<string, JSONSchema4> = {};

  for (const [, item] of linter.rules) {
    properties[item.name] = {
      description: item.description,
      title: item.name.startsWith('@typescript') ? 'Rules' : 'Core rules',
      default: 'off',
      oneOf: [defaultRuleSchema, { $ref: createRef(item.name) }],
    };
  }

  return {
    type: 'object',
    properties: {
      extends: {
        oneOf: [
          { type: 'string' },
          {
            type: 'array',
            items: { type: 'string', enum: linter.configs },
            uniqueItems: true,
          },
        ],
      },
      rules: {
        type: 'object',
        properties: properties,
        additionalProperties: false,
      },
    },
  };
}

const allowedCategories = [
  'Command-line Options',
  'Projects',
  'Compiler Diagnostics',
  'Editor Support',
  'Output Formatting',
  'Watch and Build Modes',
  'Source Map Options',
];

/**
 * Get the JSON schema for the typescript config
 * This function retrieves all typescript options, except for the ones that are not supported by the playground
 * this function uses private API from typescript, and this might break in the future
 */
export function getTypescriptJsonSchema(): JSONSchema4 {
  const properties = window.ts.optionDeclarations.reduce<
    Record<string, JSONSchema4>
  >((options, item) => {
    if (
      item.description &&
      item.category &&
      !allowedCategories.includes(item.category.message) &&
      !item.isCommandLineOnly
    ) {
      if (item.type === 'boolean') {
        options[item.name] = {
          type: 'boolean',
          description: item.description.message,
          title: item.category.message,
        };
      } else if (item.type === 'list' && item.element?.type instanceof Map) {
        options[item.name] = {
          type: 'array',
          items: {
            type: 'string',
            enum: Array.from(item.element.type.keys()),
          },
          description: item.description.message,
          title: item.category.message,
        };
      } else if (item.type instanceof Map) {
        options[item.name] = {
          type: 'string',
          description: item.description.message,
          enum: Array.from(item.type.keys()),
          title: item.category.message,
        };
      }
    }
    return options;
  }, {});

  return {
    type: 'object',
    properties: {
      compilerOptions: {
        type: 'object',
        properties: properties,
      },
    },
  };
}
