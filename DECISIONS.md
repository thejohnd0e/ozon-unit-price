# Decisions

## 2026-09-27: Use One Shared Agent Instruction File

**Decision:** `AGENTS.md` is the source of shared instructions for all coding agents. Tool-specific files should point to it and contain only necessary tool-specific guidance.

**Reason:** A single source avoids duplicated or conflicting instructions.

## 2026-09-27: Record Unknowns as TBD

**Decision:** Unverified project details are marked `TBD` until confirmed by requirements or implementation.

**Reason:** The repository has no application code or project metadata from which to infer those details.

## 2026-09-27: Package as a Least-Privilege Manifest V3 Extension

**Decision:** The extension uses Manifest V3, requests only `storage`, runs a content entry only on `https://*.ozon.ru/*`, and contains no remote code, analytics, API access, or external assets.

**Reason:** Unit-price parsing and calculation can remain local, and the packaging should not grant capabilities the feature does not need.

## 2026-09-27: Use a Versioned Settings Object with Canonical Mode Values

**Decision:** Popup state is stored at `ozon-unit-price-settings-v1` with `schemaVersion`, `displayMode`, and `debugEnabled`. Stable display values are `unit-standard`, `unit-small`, and `both`; `unit-standard` is the default.

**Reason:** A versioned, namespaced object supports future migration while keeping the popup choice stable. `unit-standard` maps to calculator modes `per-kilogram` and `per-liter`, `unit-small` maps to `per-100-grams` and `per-100-milliliters`, and `both` maps to all four.

## 2026-09-27: Load Module Content Script Through a Classic Bridge

**Decision:** The classic MV3 content-script entry dynamically imports the module implementation through `chrome.runtime.getURL`; transitive modules are declared as web-accessible resources.

**Reason:** Manifest V3 content-script entries are classic scripts, while the parser, calculator, and adapter remain separate ES modules.

## 2026-09-27: Reference Local Images Only After Files Exist

**Decision:** The manifest contains no icon keys and the README contains no preview image until the original chat attachments are copied into the documented local paths.

**Reason:** Referencing missing files would break packaging, while fabricated or remote replacements would misrepresent the supplied assets and violate local-only behavior.

## 2026-09-27: Namespace the Popup Design System

**Decision:** Popup classes and shared CSS custom properties use the `ozon-unit-price-*` namespace, with the visual contract recorded in `DESIGN.md`.

**Reason:** Explicit tokens keep the extension popup and future injected UI consistent without leaking generic selectors into Ozon pages.

## 2026-09-27: Use Supplied Local Artwork

**Decision:** Generate the extension icon sizes from `images/icio.png` and reference `images/readme.png` directly in the GitHub README.

**Reason:** Local references keep the package self-contained and use the supplied artwork without introducing remote assets.
