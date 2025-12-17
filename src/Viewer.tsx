/**
 * Viewer Component
 *
 * React component that renders data using splay's dispatch system.
 * Dispatches to ComponentOutput, then hydrates to React.
 */

import { memo, type ReactNode, type NamedExoticComponent } from "react";
import {
  dispatch,
  createRegistry,
  type Size,
  type Registry,
  type ComponentOutput,
} from "@mark1russell7/splay";
import { registerComponents } from "./components.js";
import { hydrate as defaultHydrate, type HydrationMap, createHydrate } from "./hydrate.js";

// =============================================================================
// Types
// =============================================================================

/**
 * Registry that outputs ComponentOutput
 */
export type ComponentRegistry = Registry<ComponentOutput>;

/**
 * Legacy ReactNode registry (for backwards compatibility)
 */
export type ReactRegistry = Registry<ReactNode>;

/**
 * Viewer props
 */
export interface ViewerProps {
  /** Data to render */
  data: unknown;
  /** Available size */
  size: Size;
  /** Path in render tree (default: "$") */
  path?: string;
  /** Component registry (optional - uses default primitives if not provided) */
  registry?: ComponentRegistry;
  /** Custom hydration map (optional) */
  hydrationMap?: HydrationMap;
}

// =============================================================================
// Default Registry
// =============================================================================

/**
 * Create a default registry with primitive components
 */
export function createDefaultRegistry(): ComponentRegistry {
  const registry = createRegistry<ComponentOutput>();
  registerComponents(registry);
  return registry;
}

// Lazily created default registry
let defaultRegistry: ComponentRegistry | null = null;

function getDefaultRegistry(): ComponentRegistry {
  if (!defaultRegistry) {
    defaultRegistry = createDefaultRegistry();
  }
  return defaultRegistry;
}

// =============================================================================
// Viewer Component
// =============================================================================

/**
 * Viewer component that renders any data recursively.
 *
 * @example
 * ```tsx
 * <Viewer
 *   data={{ name: "John", age: 30 }}
 *   size={{ width: 400, height: 300 }}
 * />
 * ```
 */
export const Viewer: NamedExoticComponent<ViewerProps> = memo(function Viewer({
  data,
  size,
  path = "$",
  registry,
  hydrationMap,
}: ViewerProps): ReactNode {
  // Use provided registry or default
  const componentRegistry = registry ?? getDefaultRegistry();

  // Create hydrate function (with custom map if provided)
  const hydrateOutput = hydrationMap ? createHydrate(hydrationMap) : defaultHydrate;

  // Dispatch to get ComponentOutput
  const output = dispatch<ComponentOutput>(data, size, path, {
    registry: componentRegistry,
    fallback: (type, fallbackData) => ({
      type: "__unknown__",
      props: { originalType: type, data: fallbackData },
    }),
  });

  if (!output) {
    return null;
  }

  // Hydrate to React
  return <>{hydrateOutput(output)}</>;
});

// =============================================================================
// Render Function (non-component API)
// =============================================================================

/**
 * Render data to ComponentOutput without hydration.
 * Useful for SSR or procedure-based rendering.
 *
 * @param data - Data to render
 * @param size - Available size
 * @param path - Path in render tree
 * @param registry - Component registry (optional)
 * @returns ComponentOutput
 */
export function render(
  data: unknown,
  size: Size,
  path: string = "$",
  registry?: ComponentRegistry
): ComponentOutput | undefined {
  const componentRegistry = registry ?? getDefaultRegistry();

  return dispatch<ComponentOutput>(data, size, path, {
    registry: componentRegistry,
    fallback: (type, fallbackData) => ({
      type: "__unknown__",
      props: { originalType: type, data: fallbackData },
    }),
  });
}
