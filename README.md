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

_To be filled in with the config snippet._
