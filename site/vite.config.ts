import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { createServer, defineConfig, type Plugin } from "vite";

// The Pages workflow sets SITE_BASE to "/splay-react". A local build uses the root.
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};
const base = env["SITE_BASE"] ? `${env["SITE_BASE"].replace(/\/$/, "")}/` : "/";

interface Manifest {
  version: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}
const pkg = JSON.parse(readFileSync(fileURLToPath(new URL("../package.json", import.meta.url)), "utf8")) as Manifest;

/**
 * This plugin puts the static parts of the page into index.html at build time. A reader with no script then gets
 * the title, the steps and the install command. Vite loads src/shell.tsx with the same JSX transform as the app.
 * The app replaces the static page when its script runs.
 */
function staticShell(): Plugin {
  return {
    name: "splay-react-static-shell",
    apply: "build",
    async transformIndexHtml(html) {
      const server = await createServer({
        configFile: false,
        root: fileURLToPath(new URL(".", import.meta.url)),
        logLevel: "silent",
        appType: "custom",
        server: { middlewareMode: true, hmr: false, ws: false },
        plugins: [react()],
        resolve: { dedupe: ["react", "react-dom"] },
      });
      try {
        const shell = (await server.ssrLoadModule("/src/shell.tsx")) as typeof import("./src/shell.tsx");
        return shell.withShell(html);
      } finally {
        await server.close();
      }
    },
  };
}

// The site has one page: the demo, the steps and the install. The deploy adds `status/` and `releases/`.
export default defineConfig({
  base,
  plugins: [react(), staticShell()],
  // The package source and the site use one copy of React.
  resolve: { dedupe: ["react", "react-dom"] },
  build: { target: "es2022" },
  define: {
    __BUILD__: JSON.stringify({
      sha: (env["GITHUB_SHA"] ?? "local").slice(0, 7),
      date: new Date().toISOString().slice(0, 10),
      version: pkg.version,
      splay: pkg.dependencies?.["@mark1russell7/splay"] ?? "",
      react: pkg.peerDependencies?.["react"] ?? "",
    }),
  },
});
