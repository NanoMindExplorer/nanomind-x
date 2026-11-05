# nanomind-x engine

The in-tree engine behind `nanomind-x`: the signed GraphQL client (`src/client`),
the MCP server (`src/mcp`), the CLI (`src/cli`), browser scripts and agent
skills. It is a fork of the upstream 4.0.1 engine release (see NOTICE for
upstream attribution) with transaction-ID signing on every
GraphQL call, a fixed liked-tweets resolution and core-first author parsing.

Upstream attribution lives in `NOTICE` (and `../NOTICE`). Do not remove it.

For the agent wrapper, see `../nanomind-x.mjs`. For install and use, see
`../README.md`.
