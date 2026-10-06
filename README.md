# design-system-mcp

An [MCP](https://modelcontextprotocol.io) server that exposes a small fictional design system, **design-system-mcp**, to AI tools. Instead of inventing components, props and colors, the AI looks up the real ones through three tools: `list_components`, `get_component` and `get_tokens`.

## Install

Requires Node.js 20 or newer and [pnpm](https://pnpm.io).

```bash
pnpm install
```

## Run

```bash
pnpm dev              # run from source with tsx
pnpm build && pnpm start   # run the compiled server
```

The server speaks MCP over stdio, so it waits silently for a client. Logs go to stderr only.

## Test with the MCP Inspector

```bash
pnpm inspect
```

Open the URL it prints, click **Connect**, then try the tools on the **Tools** tab.

## Connect to Claude Desktop / Cursor

Use the absolute path to your clone. Add this to `claude_desktop_config.json` (Claude Desktop) or `.cursor/mcp.json` (Cursor), then restart the app:

```json
{
  "mcpServers": {
    "design-system-mcp": {
      "command": "npx",
      "args": ["tsx", "/ABSOLUTE/PATH/TO/design-system-mcp/src/index.ts"]
    }
  }
}
```

## Tools

| Tool | Input | Returns |
|---|---|---|
| `list_components` | `category?` | Name, description and category of each component |
| `get_component` | `name` (case-insensitive) | Props, variants, tokens used, example and a11y notes |
| `get_tokens` | `category?`, `prefix?` | Matching design tokens grouped by category |
