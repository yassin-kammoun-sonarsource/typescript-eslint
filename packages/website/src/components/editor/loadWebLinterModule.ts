import type { WebLinterModule } from '@typescript-eslint/website-eslint';

export function loadWebLinterModule(): Promise<WebLinterModule> {
  return new Promise(resolve => {
    window.require(
      [
        'vs/language/typescript/tsWorker',
        document.location.origin + '/sandbox/index.js',
      ],
      function (_, webLinterModules) {
        resolve(webLinterModules as WebLinterModule);
      },
    );
  });
}
