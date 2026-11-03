/**
 * The probe of the demo. The site check of the Pages workflow starts it in a browser at each width, before the deploy. A failed
 * check stops the deploy.
 *
 * The site check reads this TypeScript file directly. It removes the types and the `export` line, and it starts the result as
 * the body of an async function.
 */

// The site check gives these helpers to the probe. Each element of this page is an HTML element.
declare const check: (name: string, ok: unknown, detail?: unknown) => boolean;
declare const until: <T>(fn: () => T | Promise<T>, ms?: number) => Promise<T>;
declare const $: (selector: string) => HTMLElement | null;
declare const $$: (selector: string) => HTMLElement[];
declare const type: (target: string | Element, text: string) => void;
declare const click: (target: string | Element) => void;

const view = (selector: string): HTMLElement[] => $$(`#hydrated ${selector}`);
const nodes = (kind: string): HTMLElement[] => $$(`#tree [data-type="${kind}"]`);
const hydratedText = (): string => $("#hydrated")?.textContent ?? "";
const viewer = (name: string, choice: string): string => `[data-viewer="${name}"][data-choice="${choice}"]`;

// The first example: the user list, with the card viewer and the grid of the package.
check("the user list hydrates to four user cards", await until(() => view(".user-card").length === 4), `${view(".user-card").length} cards`);
check("the tree of the output starts with an array", $("#tree > [data-type]")?.dataset["type"] === "array", $("#tree > [data-type]")?.dataset["type"]);
check("the tree shows four user-card nodes", nodes("user-card").length === 4, `${nodes("user-card").length} nodes`);
check("the grid of the package gives two columns", $("#hydrated .v-array")?.dataset["cols"] === "2", $("#hydrated .v-array")?.dataset["cols"]);

// A viewer toggle changes the component phase, and both panels follow.
click(viewer("user", "row"));
check("the row viewer gives four user rows", await until(() => view(".user-row").length === 4 && view(".user-card").length === 0), `${view(".user-row").length} rows`);
check("the tree follows the row viewer", nodes("user-row").length === 4 && nodes("user-card").length === 0, `${nodes("user-row").length} user-row nodes`);
click(viewer("array", "list"));
check("the list viewer gives one column", await until(() => $("#hydrated .v-array")?.dataset["cols"] === "1"), $("#hydrated .v-array")?.dataset["cols"]);
click(viewer("user", "object"));
check("the object viewer shows the keys of each user", await until(() => view(".v-key").length === 16 && view(".user-row").length === 0), `${view(".v-key").length} keys`);
click(viewer("user", "card"));
click(viewer("array", "grid"));

// The editor: typed JSON goes through both phases.
type("#json", '[{ "$type": "user", "name": "Barbara Liskov", "email": "barbara@example.com", "role": "admin", "active": true }]');
check("typed JSON hydrates to one new card", await until(() => view(".user-card").length === 1 && hydratedText().includes("Barbara Liskov")), hydratedText().slice(0, 80));
check("the card shows the initials from the component phase", $("#hydrated .avatar")?.textContent === "BL", $("#hydrated .avatar")?.textContent);
check("no example is selected after an edit", $$('#presets [aria-pressed="true"]').length === 0, $$('#presets [aria-pressed="true"]').length);
type("#json", '{ "name": ');
check("invalid JSON shows an error", await until(() => $("#json")?.getAttribute("aria-invalid") === "true" && /Not valid JSON/.test($("#json-error")?.textContent ?? "")), $("#json-error")?.textContent);
check("the panels keep the last valid data", hydratedText().includes("Barbara Liskov"), hydratedText().slice(0, 80));

// The nested tree: primitives, arrays and objects with the viewers of the package.
click('#presets [data-preset="tree"]');
check("the nested tree starts with an object", await until(() => $("#tree > [data-type]")?.dataset["type"] === "object"), $("#tree > [data-type]")?.dataset["type"]);
check("the nested tree hydrates its nested keys", view(".v-key").some((key) => key.textContent === "range") && view(".v-null").length === 1, `${view(".v-key").length} keys`);

// The product: a custom type whose component calls ctx.render for its children.
click('#presets [data-preset="product"]');
check("the product hydrates to a card with its price", await until(() => $("#hydrated .pc-price")?.textContent === "$129.50"), $("#hydrated .pc-price")?.textContent);
check("the product card renders its tags with the array viewer", $$("#hydrated .product-card .v-array .v-str").length === 3, $$("#hydrated .product-card .v-str").length);
click(viewer("product", "none"));
check("with no viewer, the fallback node shows", await until(() => view(".v-unknown").length === 1 && nodes("__unknown__").length === 1), hydratedText().slice(0, 80));
click(viewer("product", "card"));
await until(() => view(".product-card").length === 1);

// The wire: JSON.stringify, JSON.parse, and hydration of the parsed copy.
const before = $("#hydrated")?.innerHTML ?? "";
click("#wire");
check("the wire button hydrates the parsed copy", await until(() => $("#hydrated")?.dataset["source"] === "wire"), $("#hydrated")?.dataset["source"]);
check("the status tells the bytes on the wire", /gave [\d,]+ bytes/.test($("#wire-status")?.textContent ?? ""), $("#wire-status")?.textContent);
check("the copy from the wire gives the same view", $("#hydrated")?.innerHTML.replace(/ class="flash"/, "") === before.replace(/ class="flash"/, ""), "the markup changed");
click(viewer("array", "list"));
check("a new viewer goes back to the live output", await until(() => $("#hydrated")?.dataset["source"] === "live"), $("#hydrated")?.dataset["source"]);

// Panel 2 as JSON text: the text parses, and it is the output of the tree.
click("#tab-json");
const wireJson = await until(() => $("#wire-json")?.textContent ?? "");
let parsed: { type?: string } = {};
try {
  parsed = JSON.parse(wireJson) as { type?: string };
} catch {
  parsed = {};
}
check("the JSON view of the output parses as JSON", parsed.type === "product-card", wireJson.slice(0, 60));
click("#tab-tree");

check("the install section names the version", /^\d+\.\d+\.\d+/.test($("#pkg-version")?.textContent ?? ""), $("#pkg-version")?.textContent);
check("the code sample runs on the page", ($("#sample-view")?.textContent ?? "").includes("Ada Lovelace"), $("#sample-view")?.textContent);

export {};
