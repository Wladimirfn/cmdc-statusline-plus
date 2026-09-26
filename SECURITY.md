# Security Policy

## Supported versions

Only the latest published version is supported.

## Reporting a vulnerability

Open a private report through GitHub Security Advisories
(https://github.com/Wladimirfn/cmdc-statusline-plus/security/advisories/new) or email the
maintainer. Please do not open a public issue for a security problem.

## Security model

npm is a top target for supply-chain attacks (credential phishing, `preinstall`/`postinstall`
hooks, CI/CD pipeline compromise). This package is built to have as little attack surface as
possible:

- **Zero dependencies.** `dependencies`, `devDependencies`, `optionalDependencies` and
  `peerDependencies` are all empty, so installing it pulls in no third-party code and there is
  no transitive tree to poison.
- **Zero lifecycle scripts.** There is no `preinstall`/`install`/`postinstall` (the
  `package.json` has no `scripts` at all), so nothing executes on a consumer's machine when
  they install or update it. The workflow refuses to publish if this ever changes.
- **A single self-contained file.** The mod is `index.ts`; the published tarball is only that
  file plus docs and types (`npm pack --dry-run` lists exactly seven files).
- **Tokenless publishing.** Releases go through npm **trusted publishing (OIDC)** from GitHub
  Actions — no long-lived npm token exists anywhere, and provenance attestations are generated
  automatically, so anyone can verify the tarball was built from this repository.
- **No secrets in the code.** The mod reads the Command Code CLI key from the local
  `~/.commandcode/auth.json` at runtime; it never embeds, logs or transmits credentials. The
  only network call is a `GET` to the account's own usage endpoint.

## Hardening checklist (for the maintainer)

1. npm account: enable 2FA (auth-and-writes) and store recovery codes offline.
2. Configure the trusted publisher (repo `Wladimirfn/cmdc-statusline-plus`, workflow
   `publish.yml`) and then set **Publishing access → "Require two-factor authentication and
   disallow tokens"**.
3. Do not create long-lived automation tokens; 2FA-bypass tokens are already restricted and
   will lose direct publish in January 2027.
4. Protect release tags (GitHub → Settings → Tag protection) so only you can tag a release.
5. Keep `actions/*` updated (Dependabot is enabled) and never enable caching in the release job.
6. Review `npm pack --dry-run` output before every release.
