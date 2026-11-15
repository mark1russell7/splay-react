// The static HTML of the page before its script runs. Only the build (vite.config.ts) and the tests import this file,
// so react-dom/server stays out of the bundle of the page.

import { renderToStaticMarkup } from "react-dom/server";
import { StaticPage } from "./Frame";

/** The element of index.html that the app renders into. The build puts the static page into it. */
export const ROOT = '<div id="root"></div>';

/** This function gives the HTML of the static page. */
export function shellHtml(): string {
  return renderToStaticMarkup(<StaticPage />);
}

/** This function puts the static page into the root element of index.html. It throws when index.html has no root element. */
export function withShell(html: string): string {
  if (!html.includes(ROOT)) throw new Error(`index.html has no ${ROOT}.`);
  return html.replace(ROOT, () => `<div id="root">${shellHtml()}</div>`);
}
