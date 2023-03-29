import type esquery from 'esquery';
import type * as ts from 'typescript';

declare global {
  interface WindowRequire {
    <T extends unknown[]>(
      files: string[],
      success?: (...arg: T) => void,
      error?: (e: Error) => void,
    ): void;
    config: (arg: {
      paths?: Record<string, string>;
      ignoreDuplicateModules?: string[];
    }) => void;
  }

  interface Window {
    ts: typeof ts;
    require: WindowRequire;
    esquery: typeof esquery;
  }
}

declare module 'typescript' {
  interface OptionDeclarations {
    name: string;
    type?: unknown;
    category?: { message: string };
    description?: { message: string };
    element?: {
      type: unknown;
    };

    isCommandLineOnly?: boolean;
    affectsEmit?: true;
    affectsModuleResolution?: true;
    affectsSourceFile?: true;
    transpileOptionValue?: true;
  }

  const optionDeclarations: OptionDeclarations[];
}
