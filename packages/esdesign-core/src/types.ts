

export type CompiledModule =
  | {
      code: string;
      urlImports: string[];
      error?: undefined;
    }
  | {
      error: Error;
    };

