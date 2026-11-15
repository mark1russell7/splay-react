import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INSTALL, STEPS } from "./Frame";
import { ROOT, shellHtml, withShell } from "./shell";

const index = readFileSync(new URL("../index.html", import.meta.url), "utf8");

describe("the static page", () => {
  it("has the title, the lead, each step and the install command", () => {
    const html = shellHtml();
    expect(html).toContain('<h1 class="wordmark">');
    expect(html).toContain("Render any data to plain JSON");
    for (const step of STEPS) expect(html).toContain(`<h3>${step.title}</h3>`);
    expect(html).toContain(INSTALL);
  });

  it("has no control that needs the script", () => {
    expect(shellHtml()).not.toMatch(/<(button|input|textarea|select)\b/);
  });

  it("goes into the root element of index.html", () => {
    expect(index.split(ROOT)).toHaveLength(2);
    const built = withShell(index);
    expect(built).toContain(`<div id="root">${shellHtml()}</div>`);
    expect(built).not.toContain(ROOT);
  });

  it("stops the build when index.html has no root element", () => {
    expect(() => withShell("<body></body>")).toThrow(/no <div id="root">/);
  });
});
