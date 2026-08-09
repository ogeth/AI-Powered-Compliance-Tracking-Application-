/**
 * `noUncheckedSideEffectImports` requires side-effect imports to resolve to a
 * typed module. Next's ambient types only declare `*.module.css`, so plain
 * global stylesheet imports (e.g. `import "./globals.css"`) need this too.
 */
declare module "*.css";
