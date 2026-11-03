// Panel 2: the ComponentOutput as a tree that opens and closes. Each node shows its type, its props and its number of children.

import type { ReactNode } from "react";
import type { ComponentOutput } from "@mark1russell7/splay-react";

const MAX = 56;

function short(value: unknown): string {
  const json = JSON.stringify(value) ?? String(value);
  return json.length > MAX ? `${json.slice(0, MAX - 1)}…` : json;
}

/** This function gives a short text of the props: one `key: value` for each prop. A layout shows its number of cells. */
export function propsSummary(props: Record<string, unknown>): string {
  return Object.entries(props)
    .map(([key, value]) => (key === "layout" && Array.isArray(value) ? `layout: ${value.length} cells` : `${key}: ${short(value)}`))
    .join("  ");
}

function Head({ output }: { output: ComponentOutput }): ReactNode {
  const count = output.children?.length ?? 0;
  const summary = propsSummary(output.props);
  return (
    <>
      <code className="tn-type">{output.type}</code>
      {summary !== "" && (
        <span className="tn-props" title={summary}>
          {summary}
        </span>
      )}
      {count > 0 && <span className="tn-count">{count === 1 ? "1 child" : `${count} children`}</span>}
    </>
  );
}

function TreeNode({ output, depth }: { output: ComponentOutput; depth: number }): ReactNode {
  const children = output.children ?? [];
  if (children.length === 0) {
    return (
      <div className="tn leaf" data-type={output.type}>
        <Head output={output} />
      </div>
    );
  }
  return (
    <details className="tn" data-type={output.type} open={depth < 4}>
      <summary>
        <Head output={output} />
      </summary>
      <div className="tn-kids">
        {children.map((child, index) => (
          <TreeNode key={child.key ?? index} output={child} depth={depth + 1} />
        ))}
      </div>
    </details>
  );
}

/** The tree of a ComponentOutput. */
export function OutputTree({ output }: { output: ComponentOutput }): ReactNode {
  return (
    <div className="tree" id="tree">
      <TreeNode output={output} depth={0} />
    </div>
  );
}
