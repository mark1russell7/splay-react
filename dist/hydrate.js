import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =============================================================================
// Primitive Hydration Components
// =============================================================================
export const NullHydration = (_props) => (_jsx("span", { style: { color: "#888", fontStyle: "italic" }, children: "null" }));
export const UndefinedHydration = (_props) => (_jsx("span", { style: { color: "#888", fontStyle: "italic" }, children: "undefined" }));
export const StringHydration = ({ output }) => (_jsxs("span", { style: { color: "#a31515" }, children: ["\"", String(output.props["value"]), "\""] }));
export const NumberHydration = ({ output }) => (_jsx("span", { style: { color: "#098658" }, children: String(output.props["value"]) }));
export const BooleanHydration = ({ output }) => (_jsx("span", { style: { color: "#0000ff" }, children: String(output.props["value"]) }));
export const DateHydration = ({ output }) => (_jsx("span", { style: { color: "#098658" }, children: String(output.props["value"]) }));
export const ArrayHydration = ({ output, children }) => {
    const layout = output.props["layout"];
    if (!layout || !children) {
        return _jsx("div", { children: "[empty array]" });
    }
    const lastItem = layout[layout.length - 1];
    const height = lastItem ? lastItem.pos.y + lastItem.size.height : 0;
    return (_jsx("div", { style: { position: "relative", height }, children: layout.map(({ pos, size, index }) => (_jsx("div", { style: {
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: size.width,
                height: size.height,
            }, children: children[index] }, index))) }));
};
export const ObjectHydration = ({ output, children }) => {
    const keys = output.props["keys"];
    if (!keys || !children) {
        return _jsx("div", { children: "{}" });
    }
    return (_jsx("div", { style: { position: "relative" }, children: children }));
};
export const KeyValueHydration = ({ output, children }) => {
    const key = output.props["key"];
    return (_jsxs("div", { style: { display: "flex", marginBottom: 4 }, children: [_jsxs("span", { style: { width: "30%", fontWeight: "bold", color: "#881391" }, children: [key, ":"] }), _jsx("span", { style: { width: "70%" }, children: children?.[0] })] }));
};
// =============================================================================
// Default Hydration Map
// =============================================================================
/**
 * Default hydration components for primitives
 */
export const defaultHydrationMap = {
    "null": NullHydration,
    "undefined": UndefinedHydration,
    "string": StringHydration,
    "number": NumberHydration,
    "boolean": BooleanHydration,
    "date": DateHydration,
    "array": ArrayHydration,
    "object": ObjectHydration,
    "key-value": KeyValueHydration,
};
// =============================================================================
// Hydrate Function
// =============================================================================
/**
 * Create a hydrate function with custom component map.
 *
 * @param components - Map of component types to React components
 * @param fallback - Fallback component for unknown types
 * @returns Hydrate function
 */
export function createHydrate(components = defaultHydrationMap, fallback) {
    function hydrate(output) {
        // Get the component for this type
        const Component = components[output.type] ?? fallback;
        if (!Component) {
            return (_jsxs("div", { style: { color: "red", border: "1px solid red", padding: 4 }, children: ["Unknown component type: ", output.type] }));
        }
        // Hydrate children recursively
        const hydratedChildren = output.children?.map((child, i) => (_jsx("span", { children: hydrate(child) }, child.key ?? i)));
        return _jsx(Component, { output: output, children: hydratedChildren ?? [] });
    }
    return hydrate;
}
/**
 * Default hydrate function using primitive components
 */
export const hydrate = createHydrate(defaultHydrationMap);
// =============================================================================
// Extend Hydration Map
// =============================================================================
/**
 * Extend the default hydration map with custom components.
 *
 * @param custom - Custom hydration components
 * @returns Extended hydration map
 */
export function extendHydrationMap(custom) {
    return { ...defaultHydrationMap, ...custom };
}
//# sourceMappingURL=hydrate.js.map