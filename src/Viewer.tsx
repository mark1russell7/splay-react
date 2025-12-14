import { memo, useMemo, type ReactNode } from "react";
import { inferType, type RenderContext, type Size, type Registry } from "@mark1russell7/splay";

export type ReactRegistry = Registry<ReactNode>;

export interface ViewerProps {
  data: unknown;
  size: Size;
  path?: string;
  registry: ReactRegistry;
}

export const Viewer = memo(function Viewer({
  data,
  size,
  path = "$",
  registry,
}: ViewerProps): ReactNode {
  const type = inferType(data);
  const factory = registry.get(type);

  if (!factory) {
    return <div style={{ color: "red" }}>Unknown type: {type}</div>;
  }

  const ctx: RenderContext<unknown> = useMemo(
    () => ({
      data,
      size,
      path,
      depth: path.split(".").length,
      render: (childData: unknown, childSize: Size, childPath: string): ReactNode => (
        <Viewer data={childData} size={childSize} path={childPath} registry={registry} />
      ),
    }),
    [data, size, path, registry]
  );

  return <>{factory(ctx)}</>;
});
