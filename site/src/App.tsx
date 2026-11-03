// The page: a React 19 app that uses splay-react. The demo shows the two phases live, in three panels.

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { copyToClipboard } from "@mark1russell7/site-pages/chrome";
import type { ComponentOutput } from "@mark1russell7/splay-react";
import { hydrateSite } from "./hydration";
import {
  START_VIEWERS,
  buildRegistry,
  countNodes,
  renderText,
  sendOverWire,
  typesIn,
  type Viewers,
  type WireCopy,
} from "./model";
import { OutputTree } from "./OutputTree";
import { PRESETS } from "./presets";
import { view as sampleView } from "./sample";
import sampleSource from "./sample.tsx?raw";
import { useTheme } from "./theme";

const REPO = "https://github.com/mark1russell7/splay-react";
const NPM = "https://www.npmjs.com/package/@mark1russell7/splay-react";
const INSTALL = "pnpm add @mark1russell7/splay-react react react-dom";
const HEIGHT = 400;

interface Choice<V extends string> {
  readonly value: V;
  readonly label: string;
}

const VIEWER_CHOICES: { readonly [K in keyof Viewers]: readonly Choice<Viewers[K]>[] } = {
  user: [
    { value: "card", label: "Card" },
    { value: "row", label: "Row" },
    { value: "object", label: "Object" },
  ],
  product: [
    { value: "card", label: "Card" },
    { value: "object", label: "Object" },
    { value: "none", label: "None" },
  ],
  array: [
    { value: "grid", label: "Grid" },
    { value: "list", label: "List" },
  ],
};

const bytes = (n: number): string => `${n.toLocaleString("en-US")} bytes`;

function Segment<K extends keyof Viewers>(props: {
  name: K;
  value: Viewers[K];
  used: boolean;
  onChange: (value: Viewers[K]) => void;
}): ReactNode {
  const { name, value, used, onChange } = props;
  return (
    <div className={used ? "seg-group" : "seg-group unused"}>
      <span className="seg-label" id={`seg-${name}`}>
        <code>{name}</code>
        {!used && <span className="seg-note">not in the data</span>}
      </span>
      <div className="seg" role="radiogroup" aria-labelledby={`seg-${name}`}>
        {VIEWER_CHOICES[name].map((choice) => (
          <button
            key={choice.value}
            type="button"
            role="radio"
            aria-checked={choice.value === value}
            data-viewer={name}
            data-choice={choice.value}
            onClick={() => onChange(choice.value as Viewers[K])}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }): ReactNode {
  const [state, setState] = useState(label);
  return (
    <button
      type="button"
      className="copy"
      onClick={() => {
        void copyToClipboard(text).then((ok) => setState(ok ? "Copied" : "Copy failed"));
        window.setTimeout(() => setState(label), 1600);
      }}
    >
      {state}
    </button>
  );
}

/** The editor. The text area has no React value: a native `input` listener reads it, so a script that sets `value` works too. */
function useEditor(initial: string): readonly [string, (text: string) => void, RefObject<HTMLTextAreaElement | null>] {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (el === null) return undefined;
    const read = (): void => setText(el.value);
    el.addEventListener("input", read);
    return () => el.removeEventListener("input", read);
  }, []);
  const replace = (next: string): void => {
    if (ref.current !== null) ref.current.value = next;
    setText(next);
  };
  return [text, replace, ref] as const;
}

/** The width of an element, in steps of 8 pixels. The component phase gets it as the size. */
function useWidth(ref: RefObject<HTMLElement | null>, fallback: number): number {
  const [width, setWidth] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el === null) return undefined;
    const measure = (): void => setWidth(Math.max(160, Math.floor(el.clientWidth / 8) * 8));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

function Demo(): ReactNode {
  const first = PRESETS[0]!;
  const [text, setText, editorRef] = useEditor(first.text);
  const presetId = PRESETS.find((preset) => preset.text === text)?.id ?? null;
  const [viewers, setViewers] = useState<Viewers>(START_VIEWERS);
  const [tab, setTab] = useState<"tree" | "json">("tree");
  const [wire, setWire] = useState<{ readonly from: ComponentOutput; readonly copy: WireCopy; readonly at: number } | null>(null);
  const reactRef = useRef<HTMLDivElement | null>(null);
  const width = useWidth(reactRef, 360);

  const registry = useMemo(() => buildRegistry(viewers), [viewers]);
  const result = useMemo(() => renderText(text, registry, { width, height: HEIGHT }), [text, registry, width]);
  const lastGood = useRef<{ output: ComponentOutput; data: unknown } | null>(null);
  if (result.ok) lastGood.current = { output: result.output, data: result.data };
  const good = lastGood.current;
  const output = good?.output ?? null;
  const used = useMemo(() => typesIn(good?.data), [good?.data]);
  const json = useMemo(() => (output === null ? "" : JSON.stringify(output, null, 2)), [output]);
  const size = useMemo(() => (output === null ? 0 : new TextEncoder().encode(JSON.stringify(output)).length), [output]);

  // A wire copy is for one output. After a change of the data or of a viewer, panel 3 shows the live output again.
  const fromWire = wire !== null && wire.from === output;
  const shown = fromWire ? wire.copy.copy : output;
  const hydrated = useMemo(() => (shown === null ? null : hydrateSite(shown)), [shown]);

  const pick = (id: string): void => {
    const preset = PRESETS.find((p) => p.id === id);
    if (preset === undefined) return;
    setText(preset.text);
  };

  return (
    <section id="demo" className="demo" aria-label="Live demo">
      <div className="controls">
        <div className="ctl-row">
          <span className="ctl-label" id="presets-label">
            Data
          </span>
          <div className="chips" id="presets" role="group" aria-labelledby="presets-label">
            {PRESETS.map((preset) => (
              <button key={preset.id} type="button" className="chip" data-preset={preset.id} aria-pressed={presetId === preset.id} onClick={() => pick(preset.id)}>
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <div className="ctl-row">
          <span className="ctl-label">Viewers</span>
          <div className="segs" id="viewers">
            <Segment name="user" value={viewers.user} used={used.has("user")} onChange={(user) => setViewers((v) => ({ ...v, user }))} />
            <Segment name="product" value={viewers.product} used={used.has("product")} onChange={(product) => setViewers((v) => ({ ...v, product }))} />
            <Segment name="array" value={viewers.array} used={used.has("array")} onChange={(array) => setViewers((v) => ({ ...v, array }))} />
          </div>
        </div>
      </div>

      <div className="panels">
        <section className="panel p-data" aria-labelledby="h-data">
          <header className="ph">
            <span className="num" aria-hidden="true">
              1
            </span>
            <div>
              <h2 id="h-data">Data</h2>
              <p>Edit the JSON. An object with the key <code>"$type"</code> gets that type.</p>
            </div>
          </header>
          <textarea
            id="json"
            ref={editorRef}
            className="editor mono"
            defaultValue={first.text}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            wrap="off"
            aria-label="The data, as JSON"
            aria-invalid={!result.ok}
            aria-describedby="json-error"
          />
          <p id="json-error" className={result.ok ? "status" : "status bad"} role="status">
            {result.ok ? "Valid JSON. The panels update as you type." : `Not valid JSON: ${result.error} The panels show the last valid data.`}
          </p>
        </section>

        <section className={result.ok ? "panel p-out" : "panel p-out stale"} aria-labelledby="h-out">
          <header className="ph">
            <span className="num" aria-hidden="true">
              2
            </span>
            <div>
              <h2 id="h-out">ComponentOutput</h2>
              <p>The component phase. Plain JSON, so it can cross a wire.</p>
            </div>
          </header>
          <div className="tabs" role="tablist" aria-label="View of the output">
            <button type="button" role="tab" id="tab-tree" aria-selected={tab === "tree"} onClick={() => setTab("tree")}>
              Tree
            </button>
            <button type="button" role="tab" id="tab-json" aria-selected={tab === "json"} onClick={() => setTab("json")}>
              JSON
            </button>
            <span className="stats" id="stats">
              {output === null ? "" : `${countNodes(output)} nodes · ${bytes(size)}`}
            </span>
          </div>
          <div className="panel-body out-body">
            {output !== null && tab === "tree" && <OutputTree output={output} />}
            {output !== null && tab === "json" && (
              <pre className="wire-json scroll-cue mono" id="wire-json">
                {json}
              </pre>
            )}
          </div>
          <button
            type="button"
            className="wire-button"
            id="wire"
            disabled={output === null}
            onClick={() => output !== null && setWire({ from: output, copy: sendOverWire(output), at: Date.now() })}
          >
            <span aria-hidden="true">⇢</span> Send over the wire
          </button>
        </section>

        <section className="panel p-react" aria-labelledby="h-react">
          <header className="ph">
            <span className="num" aria-hidden="true">
              3
            </span>
            <div>
              <h2 id="h-react">React elements</h2>
              <p>
                The hydration phase. <code>createHydrate</code> gives a component for each type.
              </p>
            </div>
          </header>
          <p className={fromWire ? "source wire" : "source"} id="wire-status" role="status">
            {fromWire
              ? `From the wire: JSON.stringify gave ${bytes(wire.copy.bytes)}, and JSON.parse gave the copy that hydrated to this view.`
              : "Live: hydrated from the output in memory."}
          </p>
          <div className="panel-body react-body" ref={reactRef} id="hydrated" data-source={fromWire ? "wire" : "live"}>
            <div className={fromWire ? "flash" : undefined} key={fromWire ? wire.at : "live"}>
              {hydrated}
            </div>
          </div>
        </section>
      </div>
      <p className="size-note">
        The component phase gets the width of panel 3 as its size: {width} × {HEIGHT} px.
      </p>
    </section>
  );
}

const STEPS: readonly { title: string; body: ReactNode }[] = [
  {
    title: "Dispatch",
    body: (
      <>
        splay finds the type of each value: a primitive, an array, an object, or a custom type from <code>TYPE_SYMBOL</code>.
      </>
    ),
  },
  {
    title: "Component phase",
    body: (
      <>
        The registry gives a component for the type. The component gives a <code>ComponentOutput</code>: a type, props and children. It
        uses <code>ctx.render</code> for each child.
      </>
    ),
  },
  {
    title: "The wire",
    body: <>The output is plain JSON. A server, a worker or a procedure can make it, and the browser gets it as text.</>,
  },
  {
    title: "Hydration phase",
    body: (
      <>
        <code>createHydrate</code> changes each node to a React element. <code>extendHydrationMap</code> adds your types. The{" "}
        <code>Viewer</code> component does both phases in one step.
      </>
    ),
  },
];

export function App(): ReactNode {
  const [theme, nextTheme] = useTheme();
  return (
    <>
      <a className="skip" href="#demo">
        Skip to the demo
      </a>
      <header className="top">
        <div className="brand">
          <h1 className="wordmark">
            <span className="mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            splay-react
          </h1>
          <p className="lead">
            Render any data to plain JSON, then hydrate the JSON to React elements. Change the data or a viewer, and the two phases change
            live.
          </p>
        </div>
        <nav className="links" aria-label="Site">
          <a href="#how">How it works</a>
          <a href="#install">Install</a>
          <a href="releases/">Releases</a>
          <a href="status/">Status</a>
          <a href={REPO}>GitHub</a>
          <button type="button" className="theme" id="theme" onClick={nextTheme} aria-label={`Color theme: ${theme}. Select to change.`}>
            Theme: {theme}
          </button>
        </nav>
      </header>

      <main>
        <Demo />

        <section id="how" className="section" aria-labelledby="how-title">
          <h2 id="how-title">How it works</h2>
          <ol className="steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="step">
                <span className="num" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="install" className="section" aria-labelledby="install-title">
          <h2 id="install-title">Install</h2>
          <div className="pkg" id="pkg">
            <a className="pkg-name" href={NPM}>
              <code>@mark1russell7/splay-react</code>
              <span className="ver" id="pkg-version">
                {__BUILD__.version}
              </span>
            </a>
            <span className="pill">
              peer <code>react {__BUILD__.react}</code>
            </span>
            <span className="pill">
              uses <code>@mark1russell7/splay {__BUILD__.splay}</code>
            </span>
            <a className="pill link" href="https://github.com/mark1russell7/splay">
              splay core
            </a>
          </div>
          <div className="codeblock">
            <div className="code-head">
              <span>shell</span>
              <CopyButton text={INSTALL} />
            </div>
            <pre className="scroll-cue mono">
              <code id="install-cmd">{INSTALL}</code>
            </pre>
          </div>
          <p className="hint">
            This code is the pattern of the demo above. The typecheck of the site examines it, and the page shows its result:
          </p>
          <div className="codeblock">
            <div className="code-head">
              <span>sample.tsx</span>
              <CopyButton text={sampleSource.trim()} />
            </div>
            <pre className="scroll-cue mono">
              <code id="sample">{sampleSource.trim()}</code>
            </pre>
          </div>
          <div className="sample-result">
            <span className="ctl-label">Result</span>
            <div id="sample-view">{sampleView}</div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <p>
          <a href={REPO}>github.com/mark1russell7/splay-react</a> · version {__BUILD__.version} · build {__BUILD__.sha} of {__BUILD__.date}
        </p>
      </footer>
    </>
  );
}
