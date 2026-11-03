import { TYPE_SYMBOL, type ComponentOutput } from "@mark1russell7/splay-react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { hydrateSite } from "./hydration";
import { START_VIEWERS, buildRegistry, countNodes, renderText, sendOverWire, typesIn, withTypes, type Viewers } from "./model";
import { propsSummary } from "./OutputTree";
import { PRESETS } from "./presets";
import { output as sampleOutput, view as sampleView, wire as sampleWire } from "./sample";
import { initials } from "./viewers";

const SIZE = { width: 400, height: 400 };

function run(id: string, viewers: Viewers = START_VIEWERS): ComponentOutput {
  const preset = PRESETS.find((p) => p.id === id);
  if (preset === undefined) throw new Error(`no preset ${id}`);
  const result = renderText(preset.text, buildRegistry(viewers), SIZE);
  if (!result.ok) throw new Error(result.error);
  return result.output;
}

describe("withTypes", () => {
  it("changes the key $type to TYPE_SYMBOL, at each depth", () => {
    const value = withTypes({ list: [{ $type: "user", name: "A" }] }) as { list: Record<string | symbol, unknown>[] };
    const user = value.list[0]!;
    expect(user[TYPE_SYMBOL]).toBe("user");
    expect(Object.keys(user)).toEqual(["name"]);
  });

  it("keeps a $type that is not a string as a key", () => {
    expect(withTypes({ $type: 1 })).toEqual({ $type: 1 });
  });
});

describe("the component phase", () => {
  it("gives a user card for each user of the user list", () => {
    const output = run("users");
    expect(output.type).toBe("array");
    expect(output.children?.map((child) => child.type)).toEqual(["user-card", "user-card", "user-card", "user-card"]);
    expect(output.children?.[0]?.props["initials"]).toBe("AL");
  });

  it("follows the viewer of each type", () => {
    expect(run("users", { ...START_VIEWERS, user: "row" }).children?.[0]?.type).toBe("user-row");
    expect(run("users", { ...START_VIEWERS, user: "object" }).children?.[0]?.type).toBe("object");
    expect(run("product", { ...START_VIEWERS, product: "none" }).type).toBe("__unknown__");
  });

  it("gives one column for the list viewer and two for the grid", () => {
    const xs = (output: ComponentOutput): number => new Set((output.props["layout"] as { pos: { x: number } }[]).map((cell) => cell.pos.x)).size;
    expect(xs(run("users"))).toBe(2);
    expect(xs(run("users", { ...START_VIEWERS, array: "list" }))).toBe(1);
  });

  it("renders the children of a product with ctx.render", () => {
    const output = run("product");
    expect(output.children?.map((child) => child.type)).toEqual(["array", "object"]);
  });

  it("reports text that is not JSON", () => {
    const result = renderText("{ nope", buildRegistry(START_VIEWERS), SIZE);
    expect(result.ok).toBe(false);
  });

  it("finds the types of the data", () => {
    expect([...typesIn(JSON.parse(PRESETS[0]!.text))].sort()).toEqual(["array", "user"]);
  });
});

describe("the wire", () => {
  it.each(PRESETS.map((p) => p.id))("gives a copy of %s that hydrates to the same markup", (id) => {
    const output = run(id);
    const wire = sendOverWire(output);
    expect(wire.copy).toEqual(output);
    expect(wire.bytes).toBeGreaterThan(0);
    expect(renderToStaticMarkup(hydrateSite(wire.copy))).toBe(renderToStaticMarkup(hydrateSite(output)));
    expect(countNodes(wire.copy)).toBe(countNodes(output));
  });
});

describe("the parts of the page", () => {
  it("shows the price and the tags of the product", () => {
    const html = renderToStaticMarkup(hydrateSite(run("product")));
    expect(html).toContain("$129.50");
    expect(html).toContain("12 in stock");
    expect(html).toContain("hot-swap");
  });

  it("gives initials and a short summary of props", () => {
    expect(initials("  grace  brewster hopper ")).toBe("GB");
    expect(propsSummary({ layout: [1, 2, 3] })).toBe("layout: 3 cells");
    expect(propsSummary({ key: "name" })).toBe('key: "name"');
  });

  it("runs the code sample", () => {
    expect(sampleWire).toEqual(sampleOutput);
    expect(renderToStaticMarkup(sampleView)).toContain("Ada Lovelace");
  });
});
