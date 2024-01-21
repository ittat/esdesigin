import * as React from 'react';
import * as ReactDom from 'react-dom';
import { CompiledModule } from './types';
// import { codeFrameColumns } from '@babel/code-frame';
import { transform, TransformResult } from 'sucrase';


async function resolveValues(input: Map<string, Promise<unknown>>): Promise<Map<string, unknown>> {
  const resolved = await Promise.all(input.values());
  return new Map(Array.from(input.keys(), (key, i) => [key, resolved[i]]));
}

async function createRequire(urlImports: string[]) {
  const [{ default: muiMaterialExports }, { default: coreExport }, urlModules] = await Promise.all([
    // @ts-ignore
    import('./muiExports'),
    // @ts-ignore
    import("./coreExport"),
    resolveValues(
      new Map(urlImports.map((url) => [url, import(/* webpackIgnore: true */ url)] as const)),
    ),
  ]);

  const modules: Map<string, any> = new Map([
    ['react', React],
    ['react-dom', ReactDom],
    ...coreExport,
    ...muiMaterialExports,
    ...urlModules,
  ]);

  const require = (moduleId: string): unknown => {
    let esModule = modules.get(moduleId);

    // if (!esModule) {
    //   // Custom solution for icons
    //   const iconMatch = /^@mui\/icons-material\/(.*)$/.exec(moduleId);
    //   if (iconMatch) {
    //     const iconName = iconMatch[1];
    //     const iconsModule = modules.get('@mui/icons-material');
    //     esModule = { default: (iconsModule as any)[iconName] };
    //   }
    // }

    if (esModule && typeof esModule === 'object') {
      // ESM interop
      return { ...esModule, __esModule: true };
    }

    throw new Error(`Can't resolve module "${moduleId}"`);
  };

  return require;
}

export  async function loadModule(mod: any): Promise<any> {
  if (mod.error) {
    throw mod.error;
  }

  const require = await createRequire(mod.urlImports);

  const exports: any = {};

  const globals = {
    exports,
    module: { exports },
    require,
  };

  const instantiateModuleCode = `
    (${Object.keys(globals).join(', ')}) => {
      ${mod.code}
    }
  `;

  // eslint-disable-next-line no-eval
  const instantiateModule = (0, eval)(instantiateModuleCode);

  instantiateModule(...Object.values(globals));

  return exports;
}


const IMPORT_STATEMENT_REGEX =
  /^\s*import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([^"']+)["'\s].*/gm;

export function findImports(src: string): string[] {
  return Array.from(src.matchAll(IMPORT_STATEMENT_REGEX), (match) => match[2]);
}

export function isAbsoluteUrl(maybeUrl: string) {
  try {
    return !!new URL(maybeUrl);
  } catch {
    return false;
  }
}


export function compileModule(src: string, filename: string): CompiledModule {
  const urlImports = findImports(src).filter((spec) => isAbsoluteUrl(spec));

  let compiled: TransformResult;

  try {
    compiled = transform(src, {
      production: true,
      transforms: ['jsx', 'typescript', 'imports'],
      filePath: filename,
      jsxRuntime: 'classic',
    });
  } catch (rawError) {
    // const error = errorFrom(rawError);
    // if ((error as any).loc) {
    //   error.message = [error.message, codeFrameColumns(src, { start: (error as any).loc })].join(
    //     '\n\n',
    //   );
    // }
    // return { error };

    return {
      error: {
        name: 'Error',
        message: 'sdasdasdsa'
      }
    }
  }



  return {
    ...compiled,
    urlImports,
  };
}
