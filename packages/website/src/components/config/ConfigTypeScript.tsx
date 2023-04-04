import { useSystemFile } from '@site/src/components/hooks/useSystemFile';
import type { JSONSchema4 } from 'json-schema';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ensureObject } from '../lib/json';
import { shallowEqual } from '../lib/shallowEqual';
import type { PlaygroundSystem } from '../types';
import type { ConfigOptionsType } from './ConfigEditor';
import ConfigEditor from './ConfigEditor';
import { schemaToConfigOptions } from './utils';

export interface ConfigTypeScriptProps {
  readonly className?: string;
  readonly system: PlaygroundSystem;
}

function readConfigSchema(system: PlaygroundSystem): ConfigOptionsType[] {
  const schemaFile = system.readFile('/schema/tsconfig.schema');
  if (schemaFile) {
    const schema = JSON.parse(schemaFile) as JSONSchema4;
    if (
      schema.type === 'object' &&
      schema.properties?.compilerOptions?.properties
    ) {
      return schemaToConfigOptions(
        schema.properties.compilerOptions.properties,
      );
    }
  }

  return [];
}

function ConfigTypeScript({
  className,
  system,
}: ConfigTypeScriptProps): JSX.Element {
  const [rawConfig, updateConfigObject] = useSystemFile(
    system,
    '/tsconfig.json',
  );
  const configObject = useMemo(() => {
    return ensureObject(rawConfig?.compilerOptions);
  }, [rawConfig]);

  const [options, updateOptions] = useState<ConfigOptionsType[]>([]);

  useEffect(() => {
    updateOptions(readConfigSchema(system));
  }, [system]);

  const onChange = useCallback(
    (newConfig: Record<string, unknown>) => {
      if (!shallowEqual(newConfig, ensureObject(rawConfig?.compilerOptions))) {
        updateConfigObject({
          ...rawConfig,
          compilerOptions: newConfig,
        });
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

export default ConfigTypeScript;
