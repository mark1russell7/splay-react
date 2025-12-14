import { type ReactNode, type NamedExoticComponent } from "react";
import { type Size, type Registry } from "@mark1russell7/splay";
export type ReactRegistry = Registry<ReactNode>;
export interface ViewerProps {
    data: unknown;
    size: Size;
    path?: string;
    registry: ReactRegistry;
}
export declare const Viewer: NamedExoticComponent<ViewerProps>;
//# sourceMappingURL=Viewer.d.ts.map