// The model of the demo: the registry of the viewers that the visitor selects, the data of the editor, and the wire.

import {
  TYPE_SYMBOL,
  createDefaultRegistry,
  objectComponent,
  render,
  type ComponentOutput,
  type ComponentRegistry,
  type Size,
} from "@mark1russell7/splay-react";
import { arrayList, productCard, userCard, userRow } from "./viewers";

export type UserViewer = "card" | "row" | "object";
export type ProductViewer = "card" | "object" | "none";
export type ArrayViewer = "grid" | "list";

/** The viewer of each type that the visitor can change. */
export interface Viewers {
  readonly user: UserViewer;
  readonly product: ProductViewer;
  readonly array: ArrayViewer;
}

export const START_VIEWERS: Viewers = { user: "card", product: "card", array: "grid" };

/** This function makes the registry for the viewers. It starts from the primitives of the package. */
export function buildRegistry(viewers: Viewers): ComponentRegistry {
  const registry = createDefaultRegistry();
  if (viewers.array === "list") registry.register("array", arrayList);
  registry.register("user", viewers.user === "card" ? userCard : viewers.user === "row" ? userRow : objectComponent);
  if (viewers.product === "card") registry.register("product", productCard);
  if (viewers.product === "object") registry.register("product", objectComponent);
  return registry;
}

/**
 * JSON has no symbols. Thus this function gives each object with a string key "$type" a type of splay: it removes the key
 * and sets `TYPE_SYMBOL`. The result is a copy.
 */
export function withTypes(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withTypes);
  if (value === null || typeof value !== "object") return value;
  const out: Record<string | symbol, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "$type" && typeof child === "string") out[TYPE_SYMBOL] = child;
    else out[key] = withTypes(child);
  }
  return out;
}

/** This function gives the types of splay in the data: the "$type" tags, and "array" for each array. */
export function typesIn(value: unknown, found: Set<string> = new Set()): Set<string> {
  if (Array.isArray(value)) {
    found.add("array");
    for (const item of value) typesIn(item, found);
  } else if (value !== null && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (key === "$type" && typeof child === "string") found.add(child);
      else typesIn(child, found);
    }
  }
  return found;
}

/** The result of the component phase for the text of the editor. */
export type Rendered =
  | { readonly ok: true; readonly data: unknown; readonly output: ComponentOutput }
  | { readonly ok: false; readonly error: string };

/** This function parses the text as JSON and starts the component phase. */
export function renderText(source: string, registry: ComponentRegistry, size: Size): Rendered {
  let data: unknown;
  try {
    data = JSON.parse(source);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
  const output = render(withTypes(data), size, "$", registry);
  if (output === undefined) return { ok: false, error: "The registry gave no output." };
  return { ok: true, data, output };
}

/** This function gives the number of nodes of a ComponentOutput. */
export function countNodes(output: ComponentOutput): number {
  return 1 + (output.children ?? []).reduce((sum, child) => sum + countNodes(child), 0);
}

/** The contents of the wire: the JSON text, its size in bytes, and the copy that JSON.parse gives. */
export interface WireCopy {
  readonly text: string;
  readonly bytes: number;
  readonly copy: ComponentOutput;
}

/** This function sends a ComponentOutput over a wire: it makes JSON text, then it parses the text again. */
export function sendOverWire(output: ComponentOutput): WireCopy {
  const text = JSON.stringify(output);
  return { text, bytes: new TextEncoder().encode(text).length, copy: JSON.parse(text) as ComponentOutput };
}
