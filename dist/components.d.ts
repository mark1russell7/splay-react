/**
 * Primitive Components
 *
 * Components that return serializable ComponentOutput.
 * These can be registered as procedures and called remotely.
 */
import type { RenderContext, ComponentOutput } from "@mark1russell7/splay";
export declare const nullComponent: (_ctx: RenderContext) => ComponentOutput;
export declare const undefinedComponent: (_ctx: RenderContext) => ComponentOutput;
export declare const stringComponent: (ctx: RenderContext) => ComponentOutput;
export declare const numberComponent: (ctx: RenderContext) => ComponentOutput;
export declare const booleanComponent: (ctx: RenderContext) => ComponentOutput;
export declare const dateComponent: (ctx: RenderContext) => ComponentOutput;
export declare const arrayComponent: (ctx: RenderContext) => ComponentOutput;
export declare const objectComponent: (ctx: RenderContext) => ComponentOutput;
import type { Registry } from "@mark1russell7/splay";
/**
 * Register all primitive components to a registry.
 */
export declare function registerComponents(registry: Registry<ComponentOutput>): void;
/**
 * All primitive components as a map.
 */
export declare const primitiveComponents: Record<string, (ctx: RenderContext) => ComponentOutput>;
//# sourceMappingURL=components.d.ts.map