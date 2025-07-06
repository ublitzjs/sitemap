import { minifyFile } from "@ublitzjs/dev-comments";
import path from "node:path";
await minifyFile(
  path.resolve(import.meta.dirname, "main.ts"),
  path.resolve(import.meta.dirname, "main.minified.ts")
);
