/**
 * Primitive Components
 *
 * Components that return serializable ComponentOutput.
 * These can be registered as procedures and called remotely.
 */

import type { RenderContext, ComponentOutput, Size } from "@mark1russell7/splay";
import { gridLayout, listLayout } from "@mark1russell7/splay";

// =============================================================================
// Primitive Components
// =============================================================================

export const nullComponent = (_ctx: RenderContext): ComponentOutput => ({
  type: "null",
  props: {},
});

export const undefinedComponent = (_ctx: RenderContext): ComponentOutput => ({
  type: "undefined",
  props: {},
});

export const stringComponent = (ctx: RenderContext): ComponentOutput => ({
  type: "string",
  props: { value: String(ctx.data) },
});

export const numberComponent = (ctx: RenderContext): ComponentOutput => ({
  type: "number",
  props: { value: ctx.data as number },
});

export const booleanComponent = (ctx: RenderContext): ComponentOutput => ({
  type: "boolean",
  props: { value: ctx.data as boolean },
});

export const dateComponent = (ctx: RenderContext): ComponentOutput => ({
  type: "date",
  props: { value: (ctx.data as Date).toISOString() },
});

// =============================================================================
// Recursive Components
// =============================================================================

export const arrayComponent = (ctx: RenderContext): ComponentOutput => {
  const data = ctx.data as unknown[];
  const layout = gridLayout(ctx.size, data.length, 2, 40);

  return {
    type: "array",
    props: {
      layout: layout.map(({ pos, size, index }) => ({
        pos,
        size,
        index,
      })),
    },
    children: layout.map(({ size, index }) => {
      const childPath = `${ctx.path}[${index}]`;
      return ctx.render(data[index], size, childPath) as ComponentOutput;
    }),
  };
};

export const objectComponent = (ctx: RenderContext): ComponentOutput => {
  const data = ctx.data as Record<string, unknown>;
  const entries = Object.entries(data);
  const layout = listLayout(ctx.size, entries.length, 30);

  return {
    type: "object",
    props: {
      keys: entries.map(([key]) => key),
    },
    children: layout.map(({ size, index }) => {
      const entry = entries[index];
      if (!entry) return { type: "null", props: {} };
      const [key, value] = entry;
      const childPath = `${ctx.path}.${key}`;
      const childSize: Size = { width: size.width * 0.7, height: size.height };
      return {
        type: "key-value",
        props: { key },
        children: [ctx.render(value, childSize, childPath) as ComponentOutput],
      };
    }),
  };
};

// =============================================================================
// Registry Helper
// =============================================================================

import type { Registry } from "@mark1russell7/splay";

/**
 * Register all primitive components to a registry.
 */
export function registerComponents(registry: Registry<ComponentOutput>): void {
  registry.register("null", nullComponent);
  registry.register("undefined", undefinedComponent);
  registry.register("string", stringComponent);
  registry.register("number", numberComponent);
  registry.register("boolean", booleanComponent);
  registry.register("date", dateComponent);
  registry.register("array", arrayComponent);
  registry.register("object", objectComponent);
}

/**
 * All primitive components as a map.
 */
export const primitiveComponents: Record<string, (ctx: RenderContext) => ComponentOutput> = {
  null: nullComponent,
  undefined: undefinedComponent,
  string: stringComponent,
  number: numberComponent,
  boolean: booleanComponent,
  date: dateComponent,
  array: arrayComponent,
  object: objectComponent,
};
