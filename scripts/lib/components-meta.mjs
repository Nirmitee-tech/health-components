/**
 * Reads every component exported from src/index.ts with the TypeScript compiler and describes its props.
 * Shared by gen-elements.mjs (custom elements) and gen-docs.mjs (docs props tables).
 */
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const srcDir = resolve(root, 'src') + sep;
const entry = resolve(root, 'src/index.ts');

const program = ts.createProgram([entry], {
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ES2020,
  skipLibCheck: true,
  esModuleInterop: true,
  resolveJsonModule: true,
});
const checker = program.getTypeChecker();
const sf = program.getSourceFile(entry);
const moduleSymbol = checker.getSymbolAtLocation(sf);
const exportsList = checker.getExportsOfModule(moduleSymbol);

export const kebab = (s) => s.replace(/[A-Z]+(?=[A-Z][a-z])|[A-Z]/g, (m, i) => (i ? '-' : '') + m.toLowerCase());
export const tagFor = (name) => 'co-' + kebab(name).replace(/^-/, '');
export const eventName = (prop) => 'co-' + kebab(prop.slice(2)).replace(/^-/, '');

/** Exports that are not standalone visual components. */
const SKIP = new Set(['Portal', 'ThemeProvider']);

/** Native attributes worth exposing on elements when a component accepts them (they come from @types/react). */
const NATIVE = new Set(['disabled', 'placeholder', 'name', 'value', 'defaultValue', 'checked', 'defaultChecked', 'required', 'readOnly', 'type', 'autoFocus', 'maxLength', 'min', 'max', 'step', 'rows', 'accept', 'multiple', 'autoComplete']);

const isFromSrc = (decl) => decl.getSourceFile().fileName.startsWith(srcDir.replaceAll(sep, '/')) || decl.getSourceFile().fileName.startsWith(srcDir);

function classify(name, prop, decl) {
  const typeText = decl && decl.type ? decl.type.getText() : '';
  if (name === 'children' || /ReactNode|ReactElement|JSX\.Element/.test(typeText)) return 'node';
  const t = checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(prop, decl));
  if (t.getCallSignatures().length) return /^on[A-Z]/.test(name) ? 'event' : 'function';
  const parts = t.isUnion() ? t.types : [t];
  const F = ts.TypeFlags;
  const all = (mask) => parts.every((p) => (p.flags & mask) !== 0);
  if (all(F.BooleanLike)) return 'boolean';
  if (all(F.NumberLike)) return 'number';
  if (all(F.StringLike)) return 'string';
  if (all(F.StringLike | F.NumberLike | F.BooleanLike)) return 'json';
  return 'json';
}

function propsTypeOf(symbol) {
  const decl = symbol.valueDeclaration ?? symbol.declarations?.[0];
  if (!decl) return null;
  const type = checker.getTypeOfSymbolAtLocation(symbol, decl);
  const sig = type.getCallSignatures()[0];
  if (!sig) return null;
  const p = sig.getParameters()[0];
  if (!p) return null;
  return checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration ?? decl);
}

const components = [];
const seenDecl = new Map();
for (const exp of exportsList) {
  const name = exp.getName();
  if (!/^[A-Z]/.test(name) || SKIP.has(name)) continue;
  const target = exp.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exp) : exp;
  if (!(target.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable))) continue;
  const propsType = propsTypeOf(target);
  if (!propsType) continue;
  // Must render JSX: a function component returns JSX.Element / ReactNode, forwardRef/memo are exotic components.
  const declText = (target.valueDeclaration ?? target.declarations?.[0])?.getText() ?? '';
  const typeStr = checker.typeToString(checker.getTypeOfSymbolAtLocation(target, target.valueDeclaration ?? target.declarations[0]));
  const looksLikeComponent = /ExoticComponent|=> (React\.)?(JSX\.Element|ReactNode|ReactElement)|JSX\.Element|Element \| null/.test(typeStr) || /<[A-Za-z]/.test(declText);
  if (!looksLikeComponent) continue;
  const key = target.valueDeclaration ?? target.declarations[0];
  if (seenDecl.has(key)) {
    seenDecl.get(key).aliases.push(name);
    continue;
  }
  const props = {};
  for (const prop of checker.getPropertiesOfType(propsType)) {
    const decls = prop.declarations ?? [];
    const own = decls.find(isFromSrc) ?? (NATIVE.has(prop.getName()) ? decls[0] : undefined);
    if (!own) continue;
    const t = checker.getTypeOfSymbolAtLocation(prop, own);
    props[prop.getName()] = {
      kind: classify(prop.getName(), prop, own),
      doc: ts.displayPartsToString(prop.getDocumentationComment(checker)),
      optional: (prop.flags & ts.SymbolFlags.Optional) !== 0,
      type: own.type ? own.type.getText().replace(/\s+/g, ' ') : checker.typeToString(checker.getNonNullableType(t)),
      inherited: !isFromSrc(own),
    };
  }
  const file = (target.valueDeclaration ?? target.declarations[0]).getSourceFile().fileName;
  const entryObj = { name, tag: tagFor(name), props, aliases: [], file, description: ts.displayPartsToString(target.getDocumentationComment(checker)) };
  seenDecl.set(key, entryObj);
  components.push(entryObj);
}
components.sort((a, b) => a.name.localeCompare(b.name));

export { components, root };

