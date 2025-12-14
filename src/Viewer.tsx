import { memo, type ReactNode, type NamedExoticComponent } from "react";
import { dispatch, type Size, type Registry } from "@mark1russell7/splay";

export type ReactRegistry = Registry<ReactNode>;

export interface ViewerProps {
  data: unknown;
  size: Size;
  path?: string;
  registry: ReactRegistry;
}

export const Viewer: NamedExoticComponent<ViewerProps> = memo(function Viewer({
  data,
  size,
  path = "$",
  registry,
}: ViewerProps): ReactNode {
  return dispatch(data, size, path, {
    registry,
    fallback: (type) => <div style={{ color: "red" }}>Unknown type: {type}</div>,
  }) ?? null;
});
