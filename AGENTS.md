# Agent notes — cmdc-statusline-plus

A single-file Command Code mod. `index.ts` is the whole mod; `package.json` declares it to the
host through `commandcode.mods`.

## Install / load

- Install (user scope): `cmdc mods add Wladimirfn/cmdc-statusline-plus -g`
- Update: `cmdc mods update`
- Try a local copy without installing: `cmdc --mod ./index.ts`
- Confirm it loads with no warnings: `cmdc mods list`

## Rules when editing

- Keep it **English only** — no CJK/Chinese/Asian characters anywhere (comments, strings, docs).
- Preserve the ModApi contract: `cmd.ui.setStatus`, `cmd.ui.capabilities.status`,
  `cmd.hooks({onSessionStart, onSessionEnd})`, `cmd.addFlag` / `cmd.getFlag`, `cmd.addCommand`.
- Never throw out of the factory or a hook; degrade silently (a broken renderer must not break
  the session).
- Follow the existing visual language: `SEP = ' │ '` between segments (painted dim), the shared
  `renderBar()` gradient for **every** bar, and the colour rule (≥90 red, ≥80 yellow, else gray).
- Keep the 5h/week fetch fire-and-forget and out of the render path; a failure clears the
  segment only.

## Verify before committing

1. Syntax: `node "$HOME/.pi/agent/npm/node_modules/esbuild/bin/esbuild" index.ts --outfile=$TMP/sl.js`
   — must transform cleanly.
2. Load: `cmdc mods list` shows the mod with **no load warnings**.
3. Runtime: `/statusline` prints the key table; the footer line appears once a turn completes.

## Releasing

Publishing is tokenless: the `publish` workflow uses npm **trusted publishing (OIDC)**, so no
npm token exists anywhere. Never add one, and never add dependencies or lifecycle scripts —
the workflow refuses to publish if it finds either.

1. Bump `version` in `package.json` and add a `CHANGELOG.md` entry.
2. `git add -A && git commit -m "..." && git push`.
3. Push the matching tag: `git tag v<version> && git push origin v<version>`. The `publish`
   workflow then publishes to npm with automatic provenance.
4. First release only: a trusted publisher can only be configured for a package that already
   exists, so the very first publish is interactive (`npm login` → `npm publish`), then log out.
