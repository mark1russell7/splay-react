import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The Pages workflow sets SITE_BASE to "/splay-react". A local build uses the root.
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};
const base = env["SITE_BASE"] ? `${env["SITE_BASE"].replace(/\/$/, "")}/` : "/";

interface Manifest {
  version: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}
const pkg = JSON.parse(readFileSync(fileURLToPath(new URL("../package.json", import.meta.url)), "utf8")) as Manifest;

// The site has one page: the demo, the steps and the install. The deploy adds `status/` and `releases/`.
export default defineConfig({
  base,
  plugins: [react()],
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
