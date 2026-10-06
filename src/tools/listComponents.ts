import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { COMPONENT_CATEGORIES, type DesignSystemData } from "../types.js";

export function registerListComponents(server: McpServer, data: DesignSystemData) {
  server.registerTool(
    "list_components",
    {
      description:
        "List all components available in the design-system-mcp design system with a one-line description and category. Call this first to discover which components exist before writing any UI code. Only use components returned here.",
      inputSchema: {
        category: z.enum(COMPONENT_CATEGORIES).optional().describe("Only return components in this category."),
      },
    },
    async ({ category }) => {
      const result = data.components
        .filter((c) => !category || c.category === category)
        .map(({ name, description, category }) => ({ name, description, category }));
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    },
  );
}
