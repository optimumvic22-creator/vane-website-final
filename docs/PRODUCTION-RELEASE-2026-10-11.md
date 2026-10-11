# Production release preparation

Base website revision: 85f92c8. Target: the existing Vercel project
`vane-science-website` in team `vane-science`, serving vanescience.com.

CI explicitly uses the npm 11.9.0 version declared by package.json. The Node 22
runner otherwise supplied npm 10.9.9, whose optional-peer resolution rejected
the lockfile for the newer Sanity workflow tooling. No TypeScript major upgrade
is applied to the website compiler.

## Preserved production behavior

The live deployment contained source changes not present in the GitHub snapshot.
Its Brevo waitlist adapter, optional email confirmation flow, confirmation page,
and CMS-disabled fallbacks have been retained in this release. Existing inquiry
deduplication remains intact. No real contacts or emails are created by QA.

Brevo contact membership is not marketing consent. Campaigns must filter
`VANE_UPDATES_CONFIRMED=true` and respect provider suppression. The adapter never
unblocks an existing suppression. A separate request to connect athlete inquiry
notifications is pending explicit authorization and is not part of this snapshot.

## Security and verification

Compatible lockfile updates remove the reported Next.js critical vulnerability
and the available fixes for sharp, source-map-js, and undici. No forced major
version downgrade was performed. The new dependency graph is verified by the
host build; local unit checks initially reuse the prior installed dependency tree.

The braces stack-exhaustion advisory has no upstream patched version:
https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
It remains in the Sanity/code-generation and glob tooling dependency graph;
website request fields are validated data and are not passed to glob expansion.
The ordinary npm audit/CI security gate therefore still reports this inherited
tooling issue. This is not a claim of a clean audit. sprintf-js also has an
outstanding moderate advisory. These must remain visible in the handoff.

Deploy only to the existing project. Build with production configuration while
keeping domain promotion disabled, then verify pages, assets and non-writing API
checks. The previous deployment remains available for rollback. Raw MOV sources
remain in GitHub but are excluded from the deployment because the pages use the
optimized MP4 derivatives.
