import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ["react", "react-dom"] },
  define: {
    __BUILD__: JSON.stringify({ sha: "test", date: "2026-01-01", version: "0.0.0", splay: "^0.0.0", react: ">=18" }),
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
