import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { gridLayout, listLayout } from "@mark1russell7/splay";
export const nullViewer = () => _jsx("span", { style: { color: "#888" }, children: "null" });
export const undefinedViewer = () => _jsx("span", { style: { color: "#888" }, children: "undefined" });
export const stringViewer = (ctx) => (_jsxs("span", { children: ["\"", String(ctx.data), "\""] }));
export const numberViewer = (ctx) => (_jsx("span", { style: { color: "#06c" }, children: String(ctx.data) }));
export const booleanViewer = (ctx) => (_jsx("span", { style: { color: "#909" }, children: String(ctx.data) }));
export const dateViewer = (ctx) => (_jsx("span", { children: ctx.data.toISOString() }));
export const arrayViewer = (ctx) => {
    const data = ctx.data;
    const items = gridLayout(ctx.size, data.length, 2, 40);
    const lastItem = items[items.length - 1];
    const height = lastItem ? lastItem.pos.y + 40 : 0;
    return (_jsx("div", { style: { position: "relative", width: ctx.size.width, height }, children: items.map(({ pos, size, index }) => (_jsx("div", { style: {
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: size.width,
                height: size.height,
            }, children: ctx.render(data[index], size, `${ctx.path}[${index}]`) }, index))) }));
};
export const objectViewer = (ctx) => {
    const data = ctx.data;
    const entries = Object.entries(data);
    const items = listLayout(ctx.size, entries.length, 30);
    return (_jsx("div", { style: { position: "relative", width: ctx.size.width }, children: items.map(({ pos, size, index }) => {
            const entry = entries[index];
            if (!entry)
                return null;
            const [key, value] = entry;
            return (_jsxs("div", { style: {
                    position: "absolute",
                    left: pos.x,
                    top: pos.y,
                    width: size.width,
                    height: size.height,
                    display: "flex",
                }, children: [_jsxs("span", { style: { width: "30%", fontWeight: "bold" }, children: [key, ":"] }), _jsx("span", { style: { width: "70%" }, children: ctx.render(value, { width: size.width * 0.7, height: size.height }, `${ctx.path}.${key}`) })] }, key));
        }) }));
};
export function registerPrimitives(registry) {
    registry.register("null", nullViewer);
    registry.register("undefined", undefinedViewer);
    registry.register("string", stringViewer);
    registry.register("number", numberViewer);
    registry.register("boolean", booleanViewer);
    registry.register("date", dateViewer);
    registry.register("array", arrayViewer);
    registry.register("object", objectViewer);
}
//# sourceMappingURL=primitives.js.map