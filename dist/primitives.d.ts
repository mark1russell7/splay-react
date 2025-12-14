import type { ReactNode } from "react";
import type { RenderContext } from "@mark1russell7/splay";
import type { ReactRegistry } from "./Viewer.js";
export declare const nullViewer: () => ReactNode;
export declare const undefinedViewer: () => ReactNode;
export declare const stringViewer: (ctx: RenderContext) => ReactNode;
export declare const numberViewer: (ctx: RenderContext) => ReactNode;
export declare const booleanViewer: (ctx: RenderContext) => ReactNode;
export declare const dateViewer: (ctx: RenderContext) => ReactNode;
export declare const arrayViewer: (ctx: RenderContext) => ReactNode;
export declare const objectViewer: (ctx: RenderContext) => ReactNode;
export declare function registerPrimitives(registry: ReactRegistry): void;
//# sourceMappingURL=primitives.d.ts.map