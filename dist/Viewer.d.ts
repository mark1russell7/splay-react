/**
 * Viewer Component
 *
 * React component that renders data using splay's dispatch system.
 * Dispatches to ComponentOutput, then hydrates to React.
 */
import { type ReactNode, type NamedExoticComponent } from "react";
import { type Size, type Registry, type ComponentOutput } from "@mark1russell7/splay";
import { type HydrationMap } from "./hydrate.js";
/**
 * Registry that outputs ComponentOutput
 */
export type ComponentRegistry = Registry<ComponentOutput>;
/**
 * Legacy ReactNode registry (for backwards compatibility)
 */
export type ReactRegistry = Registry<ReactNode>;
/**
 * Viewer props
 */
export interface ViewerProps {
    /** Data to render */
    data: unknown;
    /** Available size */
    size: Size;
    /** Path in render tree (default: "$") */
    path?: string;
    /** Component registry (optional - uses default primitives if not provided) */
    registry?: ComponentRegistry;
    /** Custom hydration map (optional) */
    hydrationMap?: HydrationMap;
}
/**
 * Create a default registry with primitive components
 */
export declare function createDefaultRegistry(): ComponentRegistry;
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
export declare const Viewer: NamedExoticComponent<ViewerProps>;
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
export declare function render(data: unknown, size: Size, path?: string, registry?: ComponentRegistry): ComponentOutput | undefined;
//# sourceMappingURL=Viewer.d.ts.map