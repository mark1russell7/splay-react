/**
 * React Hydration Layer
 *
 * Converts ComponentOutput to React elements.
 * Maps component types to React components.
 */

import type { ReactNode, ComponentType } from "react";
import type { ComponentOutput, Size, Position } from "@mark1russell7/splay";

// =============================================================================
// Types
// =============================================================================

/**
 * Props passed to hydration components
 */
export interface HydrationProps {
  /** Component output being hydrated */
  output: ComponentOutput;
  /** Hydrated children (already converted to React) */
  children?: ReactNode[];
}

/**
 * React component that hydrates a ComponentOutput
 */
export type HydrationComponent = ComponentType<HydrationProps>;

/**
 * Map of component types to React hydration components
 */
export type HydrationMap = Record<string, HydrationComponent>;

// =============================================================================
// Primitive Hydration Components
// =============================================================================

export const NullHydration = (_props: HydrationProps): ReactNode => (
  <span style={{ color: "#888", fontStyle: "italic" }}>null</span>
);

export const UndefinedHydration = (_props: HydrationProps): ReactNode => (
  <span style={{ color: "#888", fontStyle: "italic" }}>undefined</span>
);

export const StringHydration = ({ output }: HydrationProps): ReactNode => (
  <span style={{ color: "#a31515" }}>&quot;{String(output.props["value"])}&quot;</span>
);

export const NumberHydration = ({ output }: HydrationProps): ReactNode => (
  <span style={{ color: "#098658" }}>{String(output.props["value"])}</span>
);

export const BooleanHydration = ({ output }: HydrationProps): ReactNode => (
  <span style={{ color: "#0000ff" }}>{String(output.props["value"])}</span>
);

export const DateHydration = ({ output }: HydrationProps): ReactNode => (
  <span style={{ color: "#098658" }}>{String(output.props["value"])}</span>
);

// =============================================================================
// Recursive Hydration Components
// =============================================================================

interface LayoutItem {
  pos: Position;
  size: Size;
  index: number;
}

export const ArrayHydration = ({ output, children }: HydrationProps): ReactNode => {
  const layout = output.props["layout"] as LayoutItem[] | undefined;

  if (!layout || !children) {
    return <div>[empty array]</div>;
  }

  const lastItem = layout[layout.length - 1];
  const height = lastItem ? lastItem.pos.y + lastItem.size.height : 0;

  return (
    <div style={{ position: "relative", height }}>
      {layout.map(({ pos, size, index }) => (
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
          {children[index]}
        </div>
      ))}
    </div>
  );
};

export const ObjectHydration = ({ output, children }: HydrationProps): ReactNode => {
  const keys = output.props["keys"] as string[] | undefined;

  if (!keys || !children) {
    return <div>{"{}"}</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      {children}
    </div>
  );
};

export const KeyValueHydration = ({ output, children }: HydrationProps): ReactNode => {
  const key = output.props["key"] as string;

  return (
    <div style={{ display: "flex", marginBottom: 4 }}>
      <span style={{ width: "30%", fontWeight: "bold", color: "#881391" }}>
        {key}:
      </span>
      <span style={{ width: "70%" }}>
        {children?.[0]}
      </span>
    </div>
  );
};

// =============================================================================
// Default Hydration Map
// =============================================================================

/**
 * Default hydration components for primitives
 */
export const defaultHydrationMap: HydrationMap = {
  "null": NullHydration,
  "undefined": UndefinedHydration,
  "string": StringHydration,
  "number": NumberHydration,
  "boolean": BooleanHydration,
  "date": DateHydration,
  "array": ArrayHydration,
  "object": ObjectHydration,
  "key-value": KeyValueHydration,
};

// =============================================================================
// Hydrate Function
// =============================================================================

/**
 * Create a hydrate function with custom component map.
 *
 * @param components - Map of component types to React components
 * @param fallback - Fallback component for unknown types
 * @returns Hydrate function
 */
export function createHydrate(
  components: HydrationMap = defaultHydrationMap,
  fallback?: HydrationComponent
): (output: ComponentOutput) => ReactNode {
  function hydrate(output: ComponentOutput): ReactNode {
    // Get the component for this type
    const Component = components[output.type] ?? fallback;

    if (!Component) {
      return (
        <div style={{ color: "red", border: "1px solid red", padding: 4 }}>
          Unknown component type: {output.type}
        </div>
      );
    }

    // Hydrate children recursively
    const hydratedChildren = output.children?.map((child: ComponentOutput, i: number) => (
      <span key={child.key ?? i}>{hydrate(child)}</span>
    ));

    return <Component output={output} children={hydratedChildren ?? []} />;
  }

  return hydrate;
}

/**
 * Default hydrate function using primitive components
 */
export const hydrate: (output: ComponentOutput) => ReactNode = createHydrate(defaultHydrationMap);

// =============================================================================
// Extend Hydration Map
// =============================================================================

/**
 * Extend the default hydration map with custom components.
 *
 * @param custom - Custom hydration components
 * @returns Extended hydration map
 */
export function extendHydrationMap(custom: HydrationMap): HydrationMap {
  return { ...defaultHydrationMap, ...custom };
}
