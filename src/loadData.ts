import { readFileSync } from "node:fs";
import { componentsFileSchema, tokensFileSchema, type DesignSystemData } from "./types.js";

// Resolved from this module, not process.cwd(), so any MCP client can launch the server.
function readJson(file: string): unknown {
  const url = new URL(`./data/${file}`, import.meta.url);
  try {
    return JSON.parse(readFileSync(url, "utf8"));
  } catch (err) {
    throw new Error(`Could not read ${file}: ${(err as Error).message}`);
  }
}

export function loadData(): DesignSystemData {
  const tokensResult = tokensFileSchema.safeParse(readJson("tokens.json"));
  if (!tokensResult.success) throw new Error(`Invalid tokens.json: ${tokensResult.error.message}`);

  const componentsResult = componentsFileSchema.safeParse(readJson("components.json"));
  if (!componentsResult.success) throw new Error(`Invalid components.json: ${componentsResult.error.message}`);

  const tokens = tokensResult.data;
  const components = componentsResult.data;

  const tokenNames = new Set<string>();
  for (const group of Object.values(tokens)) {
    for (const name of Object.keys(group)) {
      if (tokenNames.has(name)) throw new Error(`Duplicate token name "${name}" in tokens.json`);
      tokenNames.add(name);
    }
  }

  for (const component of components) {
    for (const token of component.tokensUsed) {
      if (!tokenNames.has(token)) {
        throw new Error(`Component "${component.name}" uses token "${token}" which does not exist in tokens.json`);
      }
    }
  }

  return { components, tokens };
}
