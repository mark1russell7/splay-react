/** The facts of the build. Vite writes them at build time. */
declare const __BUILD__: {
  readonly sha: string;
  readonly date: string;
  readonly version: string;
  readonly splay: string;
  readonly react: string;
};
