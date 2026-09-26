# Changelog

## 0.2.1

- **Fix: the footer grew extra blank rows.** The brand mark and the account-window suffix are
  appended *after* the width-fitting step, so a long line (a pinned sub-agent model, growing
  tokens/cost) overflowed the terminal and wrapped onto more rows. Their width is now reserved
  out of the budget, and the windows are dropped outright when the terminal is too narrow — which
  also restores `composeLine`'s normal segment degradation.

## 0.2.0

- **Sub-agents in the bar.** The `sub` segment now names the agent type and, when the agent's
  own config pins one, its model — e.g. `sub explore claude-haiku-4-5 12.4k`. The ModApi's
  `subagent_*` events carry no model (and sub-agent requests do not emit `model_request_*`,
  measured upstream), so a **pinned** model is the only one that can be named; an `inherit`
  agent shows the type and tokens only. Agents are read from `<project>/.commandcode/agents/*.md`
  and `~/.commandcode/agents/*.md`.
- Add `test/statusline.test.mjs` (no dependencies, plain `node`) and run it in the release workflow.
- Workflow: the security gate now rejects dependencies and install-time lifecycle hooks only
  (a maintainer `test` script is allowed).

## 0.1.1

- Docs: installing from npm is now the primary path (`cmdc mods add npm:cmdc-statusline-plus`),
  plus npm and license badges. No code changes to the mod.
- First release published through npm trusted publishing (OIDC) from GitHub Actions, so it
  carries a provenance attestation.

## 0.1.0

Fork of [`cmdc-statusline`](https://github.com/holtwood/cmdc-statusline) (MIT) with:

- **Unified look.** One continuous line: a leading brand mark (`⟡`), the shared dim `│`
  separator, and the same gradient bar the built-in context segment uses.
- **Model + effort by default.** New `plus` preset (model, effort, context, bar, percent,
  cache, cost, sub) is the package default, so the bar is useful out of the box.
- **5-hour / weekly account windows.** `GET https://api.commandcode.ai/alpha/billing/credits`
  (Bearer = the CLI key in `~/.commandcode/auth.json`) → `windowLimits.fiveHour` / `.weekly`,
  rendered with the same bar and colour thresholds as the context segment. Polled every 120s.
  Every failure clears the segment, never throws.

Everything from upstream (context bar, tokens, percent, cache, cost, speed, sub-agent tokens,
session name, git state, `/statusline` config + report) is preserved unchanged.
