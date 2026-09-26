# cmdc-statusline-plus

[![npm version](https://img.shields.io/npm/v/cmdc-statusline-plus.svg)](https://www.npmjs.com/package/cmdc-statusline-plus) [![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

A single-line status bar for **Command Code** (`cmdc`), rendered under the prompt through the
official Mods API (`cmd.ui.setStatus`).

```text
⟡ deepseek-v4.1-flash high │ ███░░░░░░░░░ 249k (25%) │ cache 99% │ $0.0014 │ 5h ░░░░░░░░░░░░ 2% ↻4h12m │ week ░░░░░░░░░░░░ 2% ↻3d11h
```

## What it shows

- **Active model** and thinking **effort** (this fork's default).
- **Context**: gradient bar, token count and % of the model window.
- **Cache** hit rate, session **cost**, output **speed** (tok/s), **sub-agent** tokens.
- **Session name**, **git** branch + change counters, **cwd**.
- **5-hour rolling and weekly account windows** (used %, reset countdown).

## Install

```sh
cmdc mods add npm:cmdc-statusline-plus -g   # from npm, user scope (all projects)
cmdc mods add cmdc-statusline-plus          # from npm, project scope
# or straight from GitHub:
cmdc mods add Wladimirfn/cmdc-statusline-plus -g
```

Then restart `cmdc` or run `/reload`. Requires Command Code ≥ 1.10.0.

## Update

```sh
cmdc mods update
```

An AI agent can update it too — see [AGENTS.md](./AGENTS.md).

## Configure

User scope `~/.commandcode/statusline.json`; project scope `<repo>/.commandcode/statusline.json`
(project overrides user). Keys are short names; CLI overrides use the `statusline.` prefix.

```json
{ "preset": "plus", "bar-width": 12, "cache": true, "cost": true, "sub": true }
```

Presets:

| Preset | Segments |
|---|---|
| `plus` *(default)* | model, effort, context, bar, percent, cache, cost, sub |
| `full` | everything (adds speed, name, git, cwd) |
| `minimal` | model, effort, context, bar, percent, git |
| `usage` | context, bar, percent, cache, cost, sub |

Run `/statusline` inside `cmdc` for a live table of every key, its default and where its value
came from; `/statusline config` edits it interactively.

## The 5h / weekly windows

Read from `GET https://api.commandcode.ai/alpha/billing/credits` (Bearer = the CLI key stored
in `~/.commandcode/auth.json`), refreshed every 120 s.

> ⚠️ This endpoint is **undocumented** — it can change without notice. Every failure
> (network, 401, missing fields) just clears that segment; it never throws and never breaks
> the bar.

## Security

Built to be as un-attackable as an npm package can be:

- **Zero dependencies, zero install scripts** — nothing third-party is pulled in and nothing
  executes on a consumer's machine at install/update time.
- **Tokenless releases** via npm **trusted publishing (OIDC)** from GitHub Actions, with
  **provenance** attestations generated automatically, so the published tarball is verifiably
  built from this repository.
- The mod makes **one** outbound request (your own account usage endpoint) and never embeds,
  logs or transmits secrets. Details in [SECURITY.md](./SECURITY.md).

## Credits

Fork of [`cmdc-statusline`](https://github.com/holtwood/cmdc-statusline) by holtwood (MIT).
The upstream segments, the `/statusline` command and its report are preserved; this fork adds
the model-by-default preset, the unified visual style and the 5h/week segments. The original
copyright is retained in [LICENSE](./LICENSE).

## License

MIT
