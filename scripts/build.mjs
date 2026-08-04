import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { build } from "esbuild";

const source = await readFile("index.source.html", "utf8");
const jsxMatch = source.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);

if (!jsxMatch) {
  throw new Error("Could not find the JSX application block in index.html");
}

await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });

const entry = `
import React from "react";
import * as ReactDOM from "react-dom/client";
${jsxMatch[1]}
`;

await build({
  stdin: {
    contents: entry,
    loader: "jsx",
    resolveDir: process.cwd(),
    sourcefile: "app.jsx",
  },
  bundle: true,
  minify: true,
  sourcemap: false,
  format: "iife",
  target: ["es2020"],
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: "dist/assets/app.js",
});

const productionHtml = source
  .replace(/\s*<link rel="preconnect" href="https:\/\/cdn\.tailwindcss\.com" crossorigin>/, "")
  .replace(/\s*<link rel="preconnect" href="https:\/\/cdn\.jsdelivr\.net" crossorigin>/, "")
  .replace(/\s*<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/, "")
  .replace(/\s*<script crossorigin src="https:\/\/cdn\.jsdelivr\.net\/npm\/react@[^>]+><\/script>/, "")
  .replace(/\s*<script crossorigin src="https:\/\/cdn\.jsdelivr\.net\/npm\/react-dom@[^>]+><\/script>/, "")
  .replace(/\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@babel\/standalone@[^>]+><\/script>/, "")
  .replace(jsxMatch[0], '<script src="./assets/app.js" defer></script>')
  .replace("</head>", '  <link rel="stylesheet" href="./assets/app.css" />\n</head>');

await writeFile("dist/index.html", productionHtml);
await writeFile("dist/.nojekyll", "");

console.log("Production HTML and JavaScript generated.");
