import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadData } from "./loadData.js";
import { registerGetComponent } from "./tools/getComponent.js";
import { registerGetTokens } from "./tools/getTokens.js";
import { registerListComponents } from "./tools/listComponents.js";

async function main() {
  const data = loadData();
  const server = new McpServer({ name: "design-system-mcp", version: "0.1.0" });

  registerListComponents(server, data);
  registerGetComponent(server, data);
  registerGetTokens(server, data);

  await server.connect(new StdioServerTransport());
  console.error("design-system-mcp MCP server running on stdio");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
