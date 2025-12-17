/**
 * React Hydration Layer
 *
 * Converts ComponentOutput to React elements.
 * Maps component types to React components.
 */
import type { ReactNode, ComponentType } from "react";
import type { ComponentOutput } from "@mark1russell7/splay";
/**
 * Props passed to hydration components
 */
export interface HydrationProps {
    /** Component output being hydrated */
    output: ComponentOutput;
    /** Hydrated children (already converted to React) */
    children?: ReactNode[];
}
/**
 * React component that hydrates a ComponentOutput
 */
export type HydrationComponent = ComponentType<HydrationProps>;
/**
 * Map of component types to React hydration components
 */
export type HydrationMap = Record<string, HydrationComponent>;
export declare const NullHydration: (_props: HydrationProps) => ReactNode;
export declare const UndefinedHydration: (_props: HydrationProps) => ReactNode;
export declare const StringHydration: ({ output }: HydrationProps) => ReactNode;
export declare const NumberHydration: ({ output }: HydrationProps) => ReactNode;
export declare const BooleanHydration: ({ output }: HydrationProps) => ReactNode;
export declare const DateHydration: ({ output }: HydrationProps) => ReactNode;
export declare const ArrayHydration: ({ output, children }: HydrationProps) => ReactNode;
export declare const ObjectHydration: ({ output, children }: HydrationProps) => ReactNode;
export declare const KeyValueHydration: ({ output, children }: HydrationProps) => ReactNode;
/**
 * Default hydration components for primitives
 */
export declare const defaultHydrationMap: HydrationMap;
/**
 * Create a hydrate function with custom component map.
 *
 * @param components - Map of component types to React components
 * @param fallback - Fallback component for unknown types
 * @returns Hydrate function
 */
export declare function createHydrate(components?: HydrationMap, fallback?: HydrationComponent): (output: ComponentOutput) => ReactNode;
/**
 * Default hydrate function using primitive components
 */
export declare const hydrate: (output: ComponentOutput) => ReactNode;
/**
 * Extend the default hydration map with custom components.
 *
 * @param custom - Custom hydration components
 * @returns Extended hydration map
 */
export declare function extendHydrationMap(custom: HydrationMap): HydrationMap;
//# sourceMappingURL=hydrate.d.ts.map