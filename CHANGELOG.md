# Changelog

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
