import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { DesignSystemData } from "../types.js";

// Classic dynamic-programming edit distance; fine for a handful of short names.
function levenshtein(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = row;
  }
  return prev[b.length];
}

export function registerGetComponent(server: McpServer, data: DesignSystemData) {
  server.registerTool(
    "get_component",
    {
      description:
        "Get full details for one design-system-mcp component: props with types, defaults and required flags, variants, design tokens it uses, a usage example, and accessibility notes. Call this before using a component so you use only props that exist.",
      inputSchema: {
        name: z.string().describe("Component name, e.g. 'Button'. Case-insensitive."),
      },
    },
    async ({ name }) => {
      const query = name.trim().toLowerCase();
      const found = data.components.find((c) => c.name.toLowerCase() === query);
      if (found) return { content: [{ type: "text", text: JSON.stringify(found, null, 2) }] };

      const names = data.components.map((c) => c.name);
      const suggestion = names.find((n) => n.toLowerCase().includes(query) || query.includes(n.toLowerCase()))
        ?? names.find((n) => levenshtein(n.toLowerCase(), query) <= 2);
      const hint = suggestion ? ` Did you mean "${suggestion}"?` : "";
      return {
        isError: true,
        content: [{ type: "text", text: `Component "${name}" not found.${hint} Available components: ${names.join(", ")}.` }],
      };
    },
  );
}
