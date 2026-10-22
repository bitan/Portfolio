/**
 * Converts public/og-image.svg → public/og-image.png
 *
 * Run once when you want a PNG fallback:
 *   npm install -D @resvg/resvg-js
 *   node scripts/generate-og.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { Resvg } from "@resvg/resvg-js";

const svg = readFileSync("public/og-image.svg", "utf8");
const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
});
const png = resvg.render().asPng();
writeFileSync("public/og-image.png", png);
console.log("✓ public/og-image.png written (1200×630)");
