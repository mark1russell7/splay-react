/**
 * Primitive Components
 *
 * Components that return serializable ComponentOutput.
 * These can be registered as procedures and called remotely.
 */
import { gridLayout, listLayout } from "@mark1russell7/splay";
// =============================================================================
// Primitive Components
// =============================================================================
export const nullComponent = (_ctx) => ({
    type: "null",
    props: {},
});
export const undefinedComponent = (_ctx) => ({
    type: "undefined",
    props: {},
});
export const stringComponent = (ctx) => ({
    type: "string",
    props: { value: String(ctx.data) },
});
export const numberComponent = (ctx) => ({
    type: "number",
    props: { value: ctx.data },
});
export const booleanComponent = (ctx) => ({
    type: "boolean",
    props: { value: ctx.data },
});
export const dateComponent = (ctx) => ({
    type: "date",
    props: { value: ctx.data.toISOString() },
});
// =============================================================================
// Recursive Components
// =============================================================================
export const arrayComponent = (ctx) => {
    const data = ctx.data;
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
            return ctx.render(data[index], size, childPath);
        }),
    };
};
export const objectComponent = (ctx) => {
    const data = ctx.data;
    const entries = Object.entries(data);
    const layout = listLayout(ctx.size, entries.length, 30);
    return {
        type: "object",
        props: {
            keys: entries.map(([key]) => key),
        },
        children: layout.map(({ size, index }) => {
            const entry = entries[index];
            if (!entry)
                return { type: "null", props: {} };
            const [key, value] = entry;
            const childPath = `${ctx.path}.${key}`;
            const childSize = { width: size.width * 0.7, height: size.height };
            return {
                type: "key-value",
                props: { key },
                children: [ctx.render(value, childSize, childPath)],
            };
        }),
    };
};
/**
 * Register all primitive components to a registry.
 */
export function registerComponents(registry) {
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
export const primitiveComponents = {
    null: nullComponent,
    undefined: undefinedComponent,
    string: stringComponent,
    number: numberComponent,
    boolean: booleanComponent,
    date: dateComponent,
    array: arrayComponent,
    object: objectComponent,
};
//# sourceMappingURL=components.js.map