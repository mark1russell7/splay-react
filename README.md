# splay-react

React adapter for [splay](https://github.com/mark1russell7/splay) recursive data renderer.

**143 lines** - A thin wrapper that brings splay's type-driven rendering to React.

## Installation

```bash
npm install github:mark1russell7/splay-react#main
```

This automatically installs `@mark1russell7/splay` as a dependency.

## Quick Start

```tsx
import { createRegistry, Viewer, registerPrimitives, TYPE_SYMBOL } from "@mark1russell7/splay-react";
import type { ReactNode } from "react";

// 1. Create a registry
const registry = createRegistry<ReactNode>();

// 2. Register built-in viewers (null, string, number, boolean, date, array, object)
registerPrimitives(registry);

// 3. Render any data
function App() {
  const data = {
    name: "Alice",
    age: 30,
    tags: ["developer", "designer"],
  };

  return (
    <Viewer
      data={data}
      size={{ width: 400, height: 300 }}
      registry={registry}
    />
  );
}
```

## Custom Types

Tag data with `TYPE_SYMBOL` to use custom viewers:

```tsx
import { TYPE_SYMBOL, createRegistry, Viewer, registerPrimitives } from "@mark1russell7/splay-react";
import type { ReactNode, RenderContext } from "@mark1russell7/splay-react";

const registry = createRegistry<ReactNode>();
registerPrimitives(registry);

// Register a custom "user" viewer
registry.register("user", (ctx: RenderContext) => {
  const user = ctx.data as { name: string; email: string; avatar: string };
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

// Tag data with custom type
const user = {
  [TYPE_SYMBOL]: "user",
  name: "Alice",
  email: "alice@example.com",
  avatar: "/avatars/alice.png",
};

// Viewer will use the "user" viewer
<Viewer data={user} size={{ width: 300, height: 200 }} registry={registry} />
```

## Recursive Rendering

Viewers can render nested data using `ctx.render()`:

```tsx
registry.register("user-list", (ctx: RenderContext) => {
  const users = ctx.data as Array<{ name: string }>;

  return (
    <div className="user-list">
      {users.map((user, i) => (
        <div key={i} className="user-item">
          {ctx.render(
            { ...user, [TYPE_SYMBOL]: "user" },
            { width: ctx.size.width, height: 60 },
            \`\${ctx.path}[\${i}]\`
          ) as ReactNode}
        </div>
      ))}
    </div>
  );
});
```

## Using Layouts

Use splay's layout functions for positioning:

```tsx
import { gridLayout, type RenderContext } from "@mark1russell7/splay-react";

registry.register("grid", (ctx: RenderContext) => {
  const items = ctx.data as unknown[];
  const layout = gridLayout(ctx.size, items.length, 3, 100);

  return (
    <div style={{ position: "relative", width: ctx.size.width }}>
      {layout.map(({ pos, size, index }) => (
        <div key={index} style={{ position: "absolute", left: pos.x, top: pos.y, width: size.width, height: size.height }}>
          {ctx.render(items[index], size, \`\${ctx.path}[\${index}]\`) as ReactNode}
        </div>
      ))}
    </div>
  );
});
```

## Async Data

Use `resolve()` for async/dynamic values:

```tsx
import { resolve, isDynamic, type DynamicValue, type Size, type ReactRegistry } from "@mark1russell7/splay-react";
import { useState, useEffect } from "react";

function AsyncViewer({ data, context, ...props }: {
  data: DynamicValue<unknown>;
  context?: Record<string, unknown>;
  size: Size;
  registry: ReactRegistry;
}) {
  const [resolved, setResolved] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDynamic(data)) {
      resolve(data, context).then(setResolved).finally(() => setLoading(false));
    } else {
      setResolved(data);
      setLoading(false);
    }
  }, [data, context]);

  if (loading) return <div>Loading...</div>;
  return <Viewer data={resolved} {...props} />;
}
```

## API

### Components

**`<Viewer>`** - The main recursive renderer component.

| Prop | Type | Description |
|------|------|-------------|
| `data` | `unknown` | Data to render |
| `size` | `Size` | Container dimensions `{ width, height }` |
| `path` | `string?` | Path prefix (default: "$") |
| `registry` | `ReactRegistry` | Type registry |

### Functions

**`registerPrimitives(registry)`** - Registers viewers for: null, undefined, string, number, boolean, date, array, object

### Re-exports from splay

```typescript
createRegistry, dispatch, resolve, isDynamic, inferType
gridLayout, listLayout, splitLayout
arrayPath, objectPath, pathDepth
TYPE_SYMBOL
// Types: Registry, ReactRegistry, RenderContext, Size, Position, etc.
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              REACT APP                                       │
│                                                                              │
│   <Viewer data={user} size={{ width: 400, height: 300 }} registry={reg} /> │
│                                                                              │
└───────────────────────────────────────┬─────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            splay-react                                       │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                          Viewer.tsx                                    │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  memo(function Viewer({ data, size, path, registry }) {         │  │  │
│  │  │    return dispatch(data, size, path, { registry, fallback });   │  │  │
│  │  │  })                                                              │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                       primitives.tsx                                   │  │
│  │                                                                        │  │
│  │   registerPrimitives(registry) adds viewers for:                      │  │
│  │   ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐ ┌────────┐           │  │
│  │   │  null  │ │ string │ │ number │ │ boolean │ │  date  │           │  │
│  │   └────────┘ └────────┘ └────────┘ └─────────┘ └────────┘           │  │
│  │   ┌────────┐ ┌────────┐                                              │  │
│  │   │ array  │ │ object │  ← recursive via ctx.render()                │  │
│  │   └────────┘ └────────┘                                              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└───────────────────────────────────────┬─────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         @mark1russell7/splay                                 │
│                                                                              │
│   dispatch()  │  inferType()  │  createRegistry()  │  layouts  │  resolve() │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## License

MIT
