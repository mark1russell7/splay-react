// The components of the page for the component phase. Each returns a ComponentOutput: plain JSON, with no React.

import { listLayout, type ComponentOutput, type RenderContext } from "@mark1russell7/splay-react";

type Fields = Record<string, unknown>;

const text = (value: unknown): string => (value === undefined || value === null ? "" : String(value));

const fields = (ctx: RenderContext): Fields => (ctx.data !== null && typeof ctx.data === "object" ? (ctx.data as Fields) : {});

/** This function gives the initials of a name: the first letter of the first two words. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/** A user as a card. The component phase calculates the initials, so the hydration has no logic. */
export const userCard = (ctx: RenderContext): ComponentOutput => {
  const user = fields(ctx);
  const name = text(user["name"]);
  return {
    type: "user-card",
    props: { name, initials: initials(name), email: text(user["email"]), role: text(user["role"]), active: user["active"] === true },
  };
};

/** A user as one row of a table. */
export const userRow = (ctx: RenderContext): ComponentOutput => {
  const user = fields(ctx);
  return {
    type: "user-row",
    props: { name: text(user["name"]), email: text(user["email"]), role: text(user["role"]), active: user["active"] === true },
  };
};

/** A product as a card. The tags and the specs go back to the registry with `ctx.render`, so each gets its own viewer. */
export const productCard = (ctx: RenderContext): ComponentOutput => {
  const product = fields(ctx);
  const half = { width: ctx.size.width, height: ctx.size.height / 2 };
  return {
    type: "product-card",
    props: { name: text(product["name"]), price: product["price"] ?? null, stock: product["stock"] ?? null },
    children: [
      ctx.render(product["tags"], half, `${ctx.path}.tags`) as ComponentOutput,
      ctx.render(product["specs"], half, `${ctx.path}.specs`) as ComponentOutput,
    ],
  };
};

/** An array as a list: one column, from `listLayout` of splay. The array of the package uses a grid of two columns. */
export const arrayList = (ctx: RenderContext): ComponentOutput => {
  const items = Array.isArray(ctx.data) ? (ctx.data as unknown[]) : [];
  const layout = listLayout(ctx.size, items.length, 40);
  return {
    type: "array",
    props: { layout: layout.map(({ pos, size, index }) => ({ pos, size, index })) },
    children: layout.map(({ size, index }) => ctx.render(items[index], size, `${ctx.path}[${index}]`) as ComponentOutput),
  };
};
