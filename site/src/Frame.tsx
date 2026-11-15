// The frame of the page: the parts that need no state and no browser. The app shows them, and the build renders them
// into index.html (shell.tsx), so a reader with no script also gets the title, the steps and the install command.

import type { ReactNode } from "react";

export const REPO = "https://github.com/mark1russell7/splay-react";
export const INSTALL = "pnpm add @mark1russell7/splay-react react react-dom";

/** The four steps of "How it works". */
export const STEPS: readonly { title: string; body: ReactNode }[] = [
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

/** The name and the lead of the page. */
export function Brand(): ReactNode {
  return (
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
        Render any data to plain JSON, then hydrate the JSON to React elements. Change the data or a viewer, and the two phases change live.
      </p>
    </div>
  );
}

/** The links of the site. The app adds the theme button as a child. */
export function SiteLinks({ children }: { readonly children?: ReactNode }): ReactNode {
  return (
    <nav className="links" aria-label="Site">
      <a href="#how">How it works</a>
      <a href="#install">Install</a>
      <a href="releases/">Releases</a>
      <a href="status/">Status</a>
      <a href={REPO}>GitHub</a>
      {children}
    </nav>
  );
}

/** The section "How it works". */
export function Steps(): ReactNode {
  return (
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
  );
}

/** The page before its script runs. The app replaces it, with the demo between the header and the steps. */
export function StaticPage(): ReactNode {
  return (
    <>
      <header className="top">
        <Brand />
        <SiteLinks />
      </header>
      <main>
        <p className="hint">
          The demo of this page has three panels: the data, the <code>ComponentOutput</code> of the component phase, and the React elements
          of the hydration phase. It starts when the script of the page runs.
        </p>
        <Steps />
        <section id="install" className="section" aria-labelledby="install-title">
          <h2 id="install-title">Install</h2>
          <pre className="scroll-cue mono">
            <code>{INSTALL}</code>
          </pre>
        </section>
      </main>
      <footer className="foot">
        <p>
          <a href={REPO}>github.com/mark1russell7/splay-react</a>
        </p>
      </footer>
    </>
  );
}
