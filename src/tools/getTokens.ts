import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { TOKEN_CATEGORIES, type DesignSystemData, type Token } from "../types.js";

export function registerGetTokens(server: McpServer, data: DesignSystemData) {
  server.registerTool(
    "get_tokens",
    {
      description:
        "Get design-system-mcp design tokens (colors, spacing, typography, radius, shadow). Always use these tokens instead of hardcoded values like hex colors or pixel sizes. Optionally filter by category or by a name prefix.",
      inputSchema: {
        category: z.enum(TOKEN_CATEGORIES).optional().describe("Only return tokens in this category."),
        prefix: z.string().optional().describe("Only return tokens whose name starts with this, e.g. 'color.text'."),
      },
    },
    async ({ category, prefix }) => {
      const result: Record<string, Record<string, Token>> = {};
      for (const [cat, tokens] of Object.entries(data.tokens)) {
        if (category && cat !== category) continue;
        const matches = Object.entries(tokens).filter(([name]) => !prefix || name.startsWith(prefix));
        if (matches.length > 0) result[cat] = Object.fromEntries(matches);
      }
      const json = JSON.stringify(result, null, 2);
      const text = Object.keys(result).length > 0 ? json : `${json}\nNo tokens matched the given filters.`;
      return { content: [{ type: "text", text }] };
    },
  );
}
