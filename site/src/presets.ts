// The example data of the editor. An object with the key "$type" gets that type (see `withTypes` in model.ts).

/** One example of the editor. */
export interface Preset {
  readonly id: string;
  readonly label: string;
  readonly text: string;
}

const users = [
  { $type: "user", name: "Ada Lovelace", email: "ada@example.com", role: "admin", active: true },
  { $type: "user", name: "Alan Turing", email: "alan@example.com", role: "editor", active: true },
  { $type: "user", name: "Grace Hopper", email: "grace@example.com", role: "viewer", active: false },
  { $type: "user", name: "Edsger Dijkstra", email: "edsger@example.com", role: "editor", active: true },
];

const tree = {
  name: "splay-react",
  version: 1,
  stable: true,
  license: null,
  phases: ["component", "hydration"],
  dependencies: {
    splay: { range: "^0.2.0", runtime: true },
    react: { range: ">=18", peer: true },
  },
};

const product = {
  $type: "product",
  name: "Mechanical keyboard",
  price: 129.5,
  stock: 12,
  tags: ["usb-c", "hot-swap", "75%"],
  specs: { switches: "tactile", weight: 0.9 },
};

/** The examples, in the order of the buttons. The first is the example at the start. */
export const PRESETS: readonly Preset[] = [
  { id: "users", label: "User list", text: JSON.stringify(users, null, 2) },
  { id: "tree", label: "Nested tree", text: JSON.stringify(tree, null, 2) },
  { id: "product", label: "Product card", text: JSON.stringify(product, null, 2) },
];
