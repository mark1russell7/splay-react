import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
/**
 * Viewer Component
 *
 * React component that renders data using splay's dispatch system.
 * Dispatches to ComponentOutput, then hydrates to React.
 */
import { memo } from "react";
import { dispatch, createRegistry, } from "@mark1russell7/splay";
import { registerComponents } from "./components.js";
import { hydrate as defaultHydrate, createHydrate } from "./hydrate.js";
// =============================================================================
// Default Registry
// =============================================================================
/**
 * Create a default registry with primitive components
 */
export function createDefaultRegistry() {
    const registry = createRegistry();
    registerComponents(registry);
    return registry;
}
// Lazily created default registry
let defaultRegistry = null;
function getDefaultRegistry() {
    if (!defaultRegistry) {
        defaultRegistry = createDefaultRegistry();
    }
    return defaultRegistry;
}
// =============================================================================
// Viewer Component
// =============================================================================
/**
 * Viewer component that renders any data recursively.
 *
 * @example
 * ```tsx
 * <Viewer
 *   data={{ name: "John", age: 30 }}
 *   size={{ width: 400, height: 300 }}
 * />
 * ```
 */
export const Viewer = memo(function Viewer({ data, size, path = "$", registry, hydrationMap, }) {
    // Use provided registry or default
    const componentRegistry = registry ?? getDefaultRegistry();
    // Create hydrate function (with custom map if provided)
    const hydrateOutput = hydrationMap ? createHydrate(hydrationMap) : defaultHydrate;
    // Dispatch to get ComponentOutput
    const output = dispatch(data, size, path, {
        registry: componentRegistry,
        fallback: (type, fallbackData) => ({
            type: "__unknown__",
            props: { originalType: type, data: fallbackData },
        }),
    });
    if (!output) {
        return null;
    }
    // Hydrate to React
    return _jsx(_Fragment, { children: hydrateOutput(output) });
});
// =============================================================================
// Render Function (non-component API)
// =============================================================================
/**
 * Render data to ComponentOutput without hydration.
 * Useful for SSR or procedure-based rendering.
 *
 * @param data - Data to render
 * @param size - Available size
 * @param path - Path in render tree
 * @param registry - Component registry (optional)
 * @returns ComponentOutput
 */
export function render(data, size, path = "$", registry) {
    const componentRegistry = registry ?? getDefaultRegistry();
    return dispatch(data, size, path, {
        registry: componentRegistry,
        fallback: (type, fallbackData) => ({
            type: "__unknown__",
            props: { originalType: type, data: fallbackData },
        }),
    });
}
//# sourceMappingURL=Viewer.js.map