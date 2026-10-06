#!/usr/bin/env node
import { loadData } from "./loadData.js";

// Placeholder until Step 3 wires up the MCP server. Never write to stdout: it is reserved for the protocol.
const data = loadData();
console.error(`Loaded ${data.components.length} components`);
