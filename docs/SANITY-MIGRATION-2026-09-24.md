# Sanity dependency migration — 2026-09-24

## Result and scope

Both the production-only and complete npm dependency audits now report **zero
findings** in every severity category. These results were obtained from the
registry on 2026-09-24; they are not a guarantee against future advisories.

The dependency change modifies `package.json` and `package-lock.json` only.
No Studio configuration change, content migration, live lead query, external
service setup, or production data write was needed. Existing application and
schema edits from other work were preserved.

| Package or runtime | Installed / required version |
| --- | --- |
| `sanity` | 6.16.0 |
| `@sanity/vision` | 6.16.0 |
| `next-sanity` | 13.3.4 |
| `react` and `react-dom` | Both pinned to 19.2.8 |
| `next` | Existing 16.3.4 retained |
| Node.js | Package range `>=22.12.0 <23`; verification used 22.23.2 |
| npm | 11.9.0 |

React 19.2.8 satisfies the resolved Portable Text editor's minimum peer range.
The renderer packages are pinned together to prevent a mismatched React and
ReactDOM pair. A React 19.3 upgrade was not required.

## Migration decisions

The [Sanity v4-to-v5 guide](https://www.sanity.io/docs/help/v4-to-v5),
[v5-to-v6 guide](https://www.sanity.io/docs/help/v5-to-v6), and official
[next-sanity migration guides](https://github.com/sanity-io/next-sanity/tree/main/packages/next-sanity)
were checked against the current source.

The repository does not use generated TypeGen imports, custom Studio auth
providers, Vite overrides, or the removed `SanityLive` props. Its existing
`defineLive({ client })`, server fetch call, embedded Studio, and typed schemas
remain compatible. The new Studio defaults include stricter development
behavior and updated search; authenticated Studio acceptance is still a
deployment check, not proven by a local schema validation.

## Targeted security overrides

Upgrading the direct packages resolved the previous chains but exposed older
versions pinned by current CLI dependencies. The latest compatible parents
still require the overrides below. They change the installed vulnerable code;
they do not suppress npm audit or exclude packages from its results.

| Parent dependency | Override | Reason and compatibility evidence |
| --- | --- | --- |
| `@module-federation/dts-plugin` | `adm-zip` 0.6.1 | Patch replacement for pinned 0.6.0; ZIP creation, serialization, entry lookup, and text round-trip passed through the actual parent-resolved import |
| `@vercel/frameworks` | `js-yaml` 3.15.2 | Same-major security update preserving the parent's `safeLoad` API; YAML config parsing passed |
| `@vercel/frameworks` | `smol-toml` 1.9.0 | Same-major security update; TOML property access and JSON serialization passed. Parsed objects use null prototypes |
| `typeid-js` | `uuid` 11.1.1 | Upstream TypeID 1.2.0 still requests vulnerable UUID 10. The patched UUID 11 backport retains CommonJS and the `v7(undefined, buffer)` / `stringify` calls used by TypeID; 1,000 unique UUIDv7 round-trips and short-buffer rejection passed |

The UUID patch is documented in the
[upstream 11.1.1 release](https://github.com/uuidjs/uuid/releases/tag/v11.1.1).
The overrides are scoped to their parent packages, not applied globally.
Recheck them when the parents release updates; remove an override only after
the parent resolves a safe version and the same compatibility/audit checks pass.
Do not use `npm audit fix --force` to replace this reviewed dependency graph.

## Recorded verification

| Check | Result |
| --- | --- |
| Initial production audit | 9 findings: 4 high, 5 moderate, 0 critical |
| Production audit after remediation | `npm audit --omit=dev --audit-level=high`: exit 0; 0 total findings |
| Complete audit including development dependencies | `npm audit`: exit 0; 0 total findings |
| TypeScript | `tsc --noEmit` on Node 22: passed |
| Sanity schema | `sanity schemas validate --workspace vane --format json`: exit 0, `[]`; no schema errors or warnings |
| Importer compatibility | ZIP, YAML, TOML, TypeID, and UUID bounds checks described above: passed |
| Package integrity | Manifest/lockfile declarations agree; installed direct versions and React/ReactDOM parity verified |
| Diff whitespace | Passed; only Git line-ending normalization notices |

Schema validation used placeholder project identifiers, empty credentials, and
`DO_NOT_TRACK=1`. It did not test a real dataset, Studio login, CORS, or write
permissions. No clean-clone `npm ci` or production build was run in this bounded
dependency pass. The parent integration review records the final application
tests, production build, browser checks, smoke test, and remote CI separately.
