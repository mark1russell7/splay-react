import type { ReactNode } from "react";
import type { RenderContext } from "@mark1russell7/splay";
import { gridLayout, listLayout } from "@mark1russell7/splay";
import type { ReactRegistry } from "./Viewer.js";

export const nullViewer = (): ReactNode => <span style={{ color: "#888" }}>null</span>;

export const undefinedViewer = (): ReactNode => <span style={{ color: "#888" }}>undefined</span>;

export const stringViewer = (ctx: RenderContext<string>): ReactNode => (
  <span>&quot;{ctx.data}&quot;</span>
);

export const numberViewer = (ctx: RenderContext<number>): ReactNode => (
  <span style={{ color: "#06c" }}>{ctx.data}</span>
);

export const booleanViewer = (ctx: RenderContext<boolean>): ReactNode => (
  <span style={{ color: "#909" }}>{String(ctx.data)}</span>
);

export const dateViewer = (ctx: RenderContext<Date>): ReactNode => (
  <span>{ctx.data.toISOString()}</span>
);

export const arrayViewer = (ctx: RenderContext<unknown[]>): ReactNode => {
  const items = gridLayout(ctx.size, ctx.data.length, 2, 40);
  const height = items.length > 0 ? items[items.length - 1].pos.y + 40 : 0;
  return (
    <div style={{ position: "relative", width: ctx.size.width, height }}>
      {items.map(({ pos, size, index }) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            width: size.width,
            height: size.height,
          }}
        >
          {ctx.render(ctx.data[index], size, `${ctx.path}[${index}]`) as ReactNode}
        </div>
      ))}
    </div>
  );
};

export const objectViewer = (ctx: RenderContext<Record<string, unknown>>): ReactNode => {
  const entries = Object.entries(ctx.data);
  const items = listLayout(ctx.size, entries.length, 30);
  return (
    <div style={{ position: "relative", width: ctx.size.width }}>
      {items.map(({ pos, size, index }) => {
        const [key, value] = entries[index];
        return (
          <div
            key={key}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              width: size.width,
              height: size.height,
              display: "flex",
            }}
          >
            <span style={{ width: "30%", fontWeight: "bold" }}>{key}:</span>
            <span style={{ width: "70%" }}>
              {ctx.render(value, { width: size.width * 0.7, height: size.height }, `${ctx.path}.${key}`) as ReactNode}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export function registerPrimitives(registry: ReactRegistry): void {
  registry.register("null", nullViewer);
  registry.register("undefined", undefinedViewer);
  registry.register("string", stringViewer);
  registry.register("number", numberViewer);
  registry.register("boolean", booleanViewer);
  registry.register("date", dateViewer);
  registry.register("array", arrayViewer);
  registry.register("object", objectViewer);
}
