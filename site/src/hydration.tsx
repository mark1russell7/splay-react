// The hydration map of the page: `extendHydrationMap` of the package, with the custom types of the demo and the colors of the
// page theme. The default map of the package has fixed colors for a light background, so the page replaces the primitives.

import type { ReactNode } from "react";
import { createHydrate, extendHydrationMap, type ComponentOutput, type HydrationMap, type HydrationProps } from "@mark1russell7/splay-react";

const text = (value: unknown): string => (value === undefined || value === null ? "" : String(value));

interface Cell {
  readonly pos: { readonly x: number };
}

/** An array: a CSS grid with one column for each column of the layout of the component phase. The rows grow with their content. */
function ArrayView({ output, children = [] }: HydrationProps): ReactNode {
  const layout = Array.isArray(output.props["layout"]) ? (output.props["layout"] as Cell[]) : [];
  if (children.length === 0) return <span className="v-empty">[ ]</span>;
  const columns = Math.max(1, new Set(layout.map((cell) => Math.round(cell.pos.x))).size);
  return (
    <div className="v-array" data-cols={columns} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {children.map((child, index) => (
        <div className="v-cell" key={index}>
          {child}
        </div>
      ))}
    </div>
  );
}

function ObjectView({ children = [] }: HydrationProps): ReactNode {
  if (children.length === 0) return <span className="v-empty">{"{ }"}</span>;
  return <div className="v-object">{children}</div>;
}

function KeyValueView({ output, children = [] }: HydrationProps): ReactNode {
  return (
    <div className="v-kv">
      <span className="v-key">{text(output.props["key"])}</span>
      <span className="v-val">{children[0]}</span>
    </div>
  );
}

function UserCard({ output }: HydrationProps): ReactNode {
  const p = output.props;
  return (
    <article className="user-card" data-active={p["active"] === true}>
      <span className="avatar" aria-hidden="true">
        {text(p["initials"])}
      </span>
      <span className="uc-text">
        <strong className="uc-name">{text(p["name"])}</strong>
        <span className="uc-email">{text(p["email"])}</span>
      </span>
      <span className="role">{text(p["role"])}</span>
    </article>
  );
}

function UserRow({ output }: HydrationProps): ReactNode {
  const p = output.props;
  const active = p["active"] === true;
  return (
    <div className="user-row" data-active={active}>
      <span className="dot" title={active ? "Active" : "Not active"} />
      <span className="ur-name">{text(p["name"])}</span>
      <span className="ur-email">{text(p["email"])}</span>
      <span className="role">{text(p["role"])}</span>
    </div>
  );
}

function ProductCard({ output, children = [] }: HydrationProps): ReactNode {
  const p = output.props;
  const price = typeof p["price"] === "number" ? `$${p["price"].toFixed(2)}` : text(p["price"]);
  const stock = typeof p["stock"] === "number" ? p["stock"] : null;
  return (
    <article className="product-card">
      <header className="pc-head">
        <strong className="pc-name">{text(p["name"])}</strong>
        <span className="pc-price">{price}</span>
      </header>
      {stock !== null && <span className={stock > 0 ? "stock in" : "stock out"}>{stock > 0 ? `${stock} in stock` : "Out of stock"}</span>}
      <div className="pc-part">
        <span className="pc-label">Tags</span>
        {children[0]}
      </div>
      <div className="pc-part">
        <span className="pc-label">Specs</span>
        {children[1]}
      </div>
    </article>
  );
}

function Unknown({ output }: HydrationProps): ReactNode {
  return (
    <div className="v-unknown" role="note">
      The registry has no viewer for the type <code>{text(output.props["originalType"])}</code>. The fallback of <code>render</code> gave
      this node.
    </div>
  );
}

/** The map of the page: the default map of the package, extended. */
export const siteHydrationMap: HydrationMap = extendHydrationMap({
  null: () => <span className="v-null">null</span>,
  undefined: () => <span className="v-null">undefined</span>,
  string: ({ output }) => <span className="v-str">&quot;{text(output.props["value"])}&quot;</span>,
  number: ({ output }) => <span className="v-num">{text(output.props["value"])}</span>,
  boolean: ({ output }) => <span className="v-bool">{text(output.props["value"])}</span>,
  date: ({ output }) => <time className="v-num">{text(output.props["value"])}</time>,
  array: ArrayView,
  object: ObjectView,
  "key-value": KeyValueView,
  "user-card": UserCard,
  "user-row": UserRow,
  "product-card": ProductCard,
  __unknown__: Unknown,
});

/** The hydrate function of the page. */
export const hydrateSite: (output: ComponentOutput) => ReactNode = createHydrate(siteHydrationMap);
