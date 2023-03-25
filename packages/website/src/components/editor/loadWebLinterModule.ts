import type { WebLinterModule } from '../linter/types';

export function loadWebLinterModule(): Promise<WebLinterModule> {
  return new Promise(resolve => {
    window.require(['vs/language/typescript/tsWorker'], () => {
      console.log(window.ts);
      // https://github.com/evanw/esbuild/issues/819 - update linter/index to proper amd to fix this
      window.require<[WebLinterModule]>(
        [document.location.origin + '/sandbox/index.js'],
        webLinterModules => {
          console.log(window.ts);
          resolve(webLinterModules);
        },
      );
    });
  });
}
