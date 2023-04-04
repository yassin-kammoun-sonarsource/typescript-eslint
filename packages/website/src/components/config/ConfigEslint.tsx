import { useSystemFile } from '@site/src/components/hooks/useSystemFile';
import type { JSONSchema4 } from 'json-schema';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ensureObject } from '../lib/json';
import { shallowEqual } from '../lib/shallowEqual';
import type { PlaygroundSystem } from '../types';
import type { ConfigOptionsType } from './ConfigEditor';
import ConfigEditor from './ConfigEditor';
import { schemaToConfigOptions } from './utils';

export interface ConfigEslintProps {
  readonly className?: string;
  readonly system: PlaygroundSystem;
}

function readConfigSchema(system: PlaygroundSystem): ConfigOptionsType[] {
  const schemaFile = system.readFile('/schema/eslint.schema');
  if (schemaFile) {
    const schema = JSON.parse(schemaFile) as JSONSchema4;
    if (schema.type === 'object' && schema.properties?.rules?.properties) {
      return schemaToConfigOptions(
        schema.properties.rules.properties,
      ).reverse();
    }
  }

  return [];
}

function ConfigEslint({ className, system }: ConfigEslintProps): JSX.Element {
  const [rawConfig, updateConfigObject] = useSystemFile(system, '/.eslintrc');
  const configObject = useMemo(() => {
    return ensureObject(rawConfig?.rules);
  }, [rawConfig]);

  const [options, updateOptions] = useState<ConfigOptionsType[]>([]);

  useEffect(() => {
    updateOptions(readConfigSchema(system));
  }, [system]);

  const onChange = useCallback(
    (newConfig: Record<string, unknown>) => {
      if (!shallowEqual(newConfig, ensureObject(rawConfig?.rules))) {
        updateConfigObject({ ...rawConfig, rules: newConfig });
      }
    },
    [rawConfig, updateConfigObject],
  );

  return (
    <ConfigEditor
      className={className}
      options={options}
      values={configObject}
      onChange={onChange}
    />
  );
}

export default ConfigEslint;
