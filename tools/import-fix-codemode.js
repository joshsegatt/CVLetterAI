/**
 * tools/import-fix-codemod.js
 * Run: node tools/import-fix-codemod.js
 *
 * WARNING: This attempts best-effort automatic edits. Inspect changes before committing.
 */

const fs = require("fs");
const path = require("path");

const repoRoot = process.cwd();
const exts = [".ts", ".tsx", ".js", ".jsx"];
const skipDirs = new Set(["node_modules", ".git", "dist", "build"]);

function walk(dir) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      out = out.concat(walk(p));
    } else if (exts.includes(path.extname(name))) {
      out.push(p);
    }
  }
  return out;
}

function makeRelativeImport(fromFile, targetAbs) {
  const rel = path.relative(path.dirname(fromFile), targetAbs).replace(/\\/g, "/");
  const normalized = rel.startsWith(".") ? rel : "./" + rel;
  // remove file extension for TS/TSX imports if ends with .ts or .tsx
  return normalized.replace(/\.(ts|tsx|js|jsx)$/, "");
}

const files = walk(path.join(repoRoot, "src"));

files.forEach((file) => {
  let s = fs.readFileSync(file, "utf8");
  let original = s;

  // 1) Rename Builderlayout -> BuilderLayout (imports and references)
  s = s.replace(/Builderlayout/g, "BuilderLayout");

  // 2) Fix exact-casing of known path segments:
  // Letter-templates must be capital L, hyphen preserved
  s = s.replace(/\/[lL]etter[-_]templates/g, "/Letter-templates");
  // cv-templates must be lowercase c
  s = s.replace(/\/[cC][vV][-_]templates/g, "/cv-templates");

  // 3) Remove broken import lines like ../../..//dist/storybook (any variant)
  s = s.replace(/import\s+[^;]*dist\/storybook[^;]*;\n?/g, "");

  // 4) Replace @/alias -> relative path to src/*
  // Match "from '@/path/to/file'" and "from \"@/path/to/file\""
  s = s.replace(/from\s+(['"])(@\/[^'"]+)\1/g, (m, q, alias) => {
    const relToSrc = alias.replace(/^@\//, "");
    const targetAbs = path.join(repoRoot, "src", relToSrc);
    if (!fs.existsSync(targetAbs) && !fs.existsSync(targetAbs + ".ts") && !fs.existsSync(targetAbs + ".tsx") && !fs.existsSync(targetAbs + ".js")) {
      // If target does not exist, leave as-is to avoid incorrect replacements
      return m;
    }
    const rel = makeRelativeImport(file, fs.existsSync(targetAbs) ? targetAbs : (fs.existsSync(targetAbs + ".tsx") ? targetAbs + ".tsx" : targetAbs + ".ts"));
    return `from "${rel}"`;
  });

  // 5) Remove duplicate external Button named imports where local Button should be used.
  // Example: import { Button, Something } from '@chakra-ui/react';
  // We'll remove Button from named import lists from common UI libs.
  s = s.replace(/import\s+\{\s*([^}]*?)\s*\}\s+from\s+['"](?:@chakra-ui\/react|@chakra-ui\/core|saas-ui|@saas-ui)['"];?/g, (m, names) => {
    // If the named import list contains Button, remove it
    const parts = names.split(",").map(p => p.trim()).filter(Boolean);
    const filtered = parts.filter(p => !/^Button\b/.test(p));
    if (filtered.length === parts.length) return m; // no Button present => unchanged
    if (filtered.length === 0) {
      // remove entire import line
      return "";
    }
    return m.replace(names, filtered.join(", "));
  });

  if (s !== original) {
    fs.writeFileSync(file, s, "utf8");
    console.log("Updated:", path.relative(repoRoot, file));
  }
});
console.log("Codemod run complete. Review changes with git diff and run TypeScript checks.");
