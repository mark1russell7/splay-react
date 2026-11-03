import {
  TYPE_SYMBOL,
  createDefaultRegistry,
  createHydrate,
  extendHydrationMap,
  render,
  type ComponentOutput,
  type RenderContext,
} from "@mark1russell7/splay-react";

// Phase 1: a component gives plain JSON for its type.
const registry = createDefaultRegistry();
registry.register("user", (ctx: RenderContext): ComponentOutput => {
  const user = ctx.data as { name: string; email: string };
  return { type: "user-card", props: { name: user.name, email: user.email } };
});

const users = [{ [TYPE_SYMBOL]: "user", name: "Ada Lovelace", email: "ada@example.com" }];
export const output = render(users, { width: 400, height: 300 }, "$", registry);

// The wire: the output is JSON, so a server can send it.
export const wire = JSON.parse(JSON.stringify(output)) as ComponentOutput;

// Phase 2: the hydration map gives a React component for each type.
const hydrate = createHydrate(
  extendHydrationMap({
    "user-card": ({ output: card }) => <p className="user">{String(card.props["name"])}</p>,
  }),
);
export const view = hydrate(wire);
