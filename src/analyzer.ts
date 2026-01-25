import * as fs from 'fs';
import * as path from 'path';

export interface ProjectInfo {
  name: string;
  description: string;
  version: string;
  language: 'javascript' | 'typescript' | 'python' | 'rust' | 'go' | 'unknown';
  dependencies: string[];
  scripts: Record<string, string>;
  mainFile: string | null;
  sourceFiles: string[];
  existingReadme: string | null;
  license: string | null;
}

export async function analyzeProject(rootDir: string): Promise<ProjectInfo> {
  const info: ProjectInfo = {
    name: path.basename(rootDir),
    description: '',
    version: '0.0.0',
    language: 'unknown',
    dependencies: [],
    scripts: {},
    mainFile: null,
    sourceFiles: [],
    existingReadme: null,
    license: null,
  };

  // Check for package.json (Node.js)
  const pkgPath = path.join(rootDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    info.name = pkg.name || info.name;
    info.description = pkg.description || '';
    info.version = pkg.version || '0.0.0';
    info.language = pkg.devDependencies?.typescript ? 'typescript' : 'javascript';
    info.dependencies = Object.keys(pkg.dependencies || {});
    info.scripts = pkg.scripts || {};
    info.mainFile = pkg.main || null;
  }

  // Check for pyproject.toml (Python)
  const pyprojectPath = path.join(rootDir, 'pyproject.toml');
  if (fs.existsSync(pyprojectPath)) {
    info.language = 'python';
    // Basic parsing - could use a TOML parser for full support
    const content = fs.readFileSync(pyprojectPath, 'utf-8');
    const nameMatch = content.match(/name\s*=\s*"([^"]+)"/);
    if (nameMatch) info.name = nameMatch[1];
  }

  // Check for Cargo.toml (Rust)
  const cargoPath = path.join(rootDir, 'Cargo.toml');
  if (fs.existsSync(cargoPath)) {
    info.language = 'rust';
    const content = fs.readFileSync(cargoPath, 'utf-8');
    const nameMatch = content.match(/name\s*=\s*"([^"]+)"/);
    if (nameMatch) info.name = nameMatch[1];
  }

  // Check for go.mod (Go)
  const goModPath = path.join(rootDir, 'go.mod');
  if (fs.existsSync(goModPath)) {
    info.language = 'go';
  }

  // Check for existing README
  const readmeFiles = ['README.md', 'README.MD', 'readme.md', 'README'];
  for (const readmeFile of readmeFiles) {
    const readmePath = path.join(rootDir, readmeFile);
    if (fs.existsSync(readmePath)) {
      info.existingReadme = fs.readFileSync(readmePath, 'utf-8');
      break;
    }
  }

  // Check for LICENSE
  const licenseFiles = ['LICENSE', 'LICENSE.md', 'LICENSE.txt'];
  for (const licenseFile of licenseFiles) {
    const licensePath = path.join(rootDir, licenseFile);
    if (fs.existsSync(licensePath)) {
      const content = fs.readFileSync(licensePath, 'utf-8');
      if (content.includes('MIT')) info.license = 'MIT';
      else if (content.includes('Apache')) info.license = 'Apache-2.0';
      else if (content.includes('GPL')) info.license = 'GPL';
      else info.license = 'Other';
      break;
    }
  }

  // Find source files
  info.sourceFiles = findSourceFiles(rootDir, info.language);

  return info;
}

function findSourceFiles(dir: string, language: string, depth = 0): string[] {
  if (depth > 3) return []; // Limit depth
  
  const extensions: Record<string, string[]> = {
    javascript: ['.js', '.mjs'],
    typescript: ['.ts', '.tsx'],
    python: ['.py'],
    rust: ['.rs'],
    go: ['.go'],
    unknown: ['.js', '.ts', '.py'],
  };

  const exts = extensions[language] || extensions.unknown;
  const files: string[] = [];
  const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '__pycache__', 'target', 'vendor'];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !ignoreDirs.includes(entry.name)) {
        files.push(...findSourceFiles(path.join(dir, entry.name), language, depth + 1));
      } else if (entry.isFile() && exts.some(ext => entry.name.endsWith(ext))) {
        files.push(path.join(dir, entry.name));
      }
    }
  } catch (e) {
    // Ignore permission errors
  }

  return files.slice(0, 20); // Limit to 20 files
}
