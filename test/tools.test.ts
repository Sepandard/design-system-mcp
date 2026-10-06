import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadData } from "../src/loadData.js";
import { registerGetComponent } from "../src/tools/getComponent.js";
import { registerGetTokens } from "../src/tools/getTokens.js";
import { registerListComponents } from "../src/tools/listComponents.js";

let client: Client;

// Calls a tool and returns whether it errored plus the text of the first content block.
async function call(name: string, args: Record<string, unknown> = {}) {
  const result = await client.callTool({ name, arguments: args });
  const text = (result.content as { text: string }[])[0].text;
  return { isError: result.isError === true, text };
}

before(async () => {
  const data = loadData();
  const server = new McpServer({ name: "test", version: "0.0.0" });
  registerListComponents(server, data);
  registerGetComponent(server, data);
  registerGetTokens(server, data);

  const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
  client = new Client({ name: "test-client", version: "0.0.0" });
  await Promise.all([server.connect(serverSide), client.connect(clientSide)]);
});

describe("loadData", () => {
  it("loads 5 components and validates token references", () => {
    assert.equal(loadData().components.length, 5);
  });
});

describe("list_components", () => {
  it("returns all 5 components", async () => {
    const { text } = await call("list_components");
    assert.equal(JSON.parse(text).length, 5);
  });

  it("filters by category", async () => {
    const { text } = await call("list_components", { category: "forms" });
    assert.deepEqual(JSON.parse(text).map((c: { name: string }) => c.name), ["Input"]);
  });
});

describe("get_component", () => {
  it("matches names case-insensitively", async () => {
    const { isError, text } = await call("get_component", { name: "button" });
    assert.equal(isError, false);
    assert.equal(JSON.parse(text).name, "Button");
  });

  it("returns an error with suggestion and available names for unknown components", async () => {
    const { isError, text } = await call("get_component", { name: "Buton" });
    assert.equal(isError, true);
    assert.match(text, /Did you mean "Button"\?/);
    assert.match(text, /Button, Input, Card, Badge, Modal/);
  });
});

describe("get_tokens", () => {
  it("filters by category", async () => {
    const { text } = await call("get_tokens", { category: "color" });
    assert.deepEqual(Object.keys(JSON.parse(text)), ["color"]);
  });

  it("filters by prefix", async () => {
    const { text } = await call("get_tokens", { prefix: "color.text" });
    assert.deepEqual(Object.keys(JSON.parse(text).color), ["color.text", "color.text-muted"]);
  });

  it("returns {} with a note when nothing matches", async () => {
    const { isError, text } = await call("get_tokens", { prefix: "nope" });
    assert.equal(isError, false);
    assert.match(text, /^\{\}\nNo tokens matched/);
  });
});
