/**
 * splay-react
 *
 * React adapter for splay recursive data renderer.
 *
 * Architecture:
 * 1. Components (components.ts) - return serializable ComponentOutput
 * 2. Hydration (hydrate.tsx) - convert ComponentOutput to React
 * 3. Viewer (Viewer.tsx) - React component combining both
 *
 * @example
 * ```tsx
 * import { Viewer } from "@mark1russell7/splay-react";
 *
 * // Simple usage - renders any data
 * <Viewer data={{ name: "John" }} size={{ width: 400, height: 300 }} />
 *
 * // For SSR/procedures - render to ComponentOutput
 * import { render, primitiveComponents } from "@mark1russell7/splay-react";
 * const output = render(data, size, path);
 * // Send output over wire, hydrate on client
 * ```
 */
export { Viewer, render, createDefaultRegistry, type ViewerProps, type ComponentRegistry, type ReactRegistry, } from "./Viewer.js";
export { nullComponent, undefinedComponent, stringComponent, numberComponent, booleanComponent, dateComponent, arrayComponent, objectComponent, registerComponents, primitiveComponents, } from "./components.js";
export { hydrate, createHydrate, extendHydrationMap, defaultHydrationMap, NullHydration, UndefinedHydration, StringHydration, NumberHydration, BooleanHydration, DateHydration, ArrayHydration, ObjectHydration, KeyValueHydration, type HydrationProps, type HydrationComponent, type HydrationMap, } from "./hydrate.js";
export { nullComponent as nullViewer, undefinedComponent as undefinedViewer, stringComponent as stringViewer, numberComponent as numberViewer, booleanComponent as booleanViewer, dateComponent as dateViewer, arrayComponent as arrayViewer, objectComponent as objectViewer, registerComponents as registerPrimitives, } from "./components.js";
export { createRegistry, TYPE_SYMBOL, dispatch, resolve, isDynamic, inferType, gridLayout, listLayout, splitLayout, arrayPath, objectPath, pathDepth, type RenderContext, type Size, type Position, type ComponentOutput, type ComponentFactory, type ResolveContext, type DynamicValue, type DispatchConfig, type Registry, } from "@mark1russell7/splay";
//# sourceMappingURL=index.d.ts.map