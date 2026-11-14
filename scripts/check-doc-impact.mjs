import { readFile } from 'node:fs/promises';
import { glob } from 'node:fs/promises';

const [beforeFile, afterFile] = process.argv.slice(2);
if (!beforeFile || !afterFile) throw new Error('Usage: check-doc-impact <before.json> <after.json>');

const [before, after] = await Promise.all([beforeFile, afterFile].map(async (file) => JSON.parse(await readFile(file, 'utf8'))));
const changedOperations = [];

for (const [path, item] of Object.entries(after.paths ?? {})) {
  for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
    if (JSON.stringify(before.paths?.[path]?.[method]) !== JSON.stringify(item[method])) changedOperations.push(`${method.toUpperCase()} ${path}`);
  }
}

const changedDocs = new Set(process.env.CHANGED_FILES?.split(',').filter(Boolean));
const impacted = [];
for await (const file of glob('docs/**/*.mdx')) {
  const content = await readFile(file, 'utf8');
  const covered = [...content.matchAll(/- (GET|POST|PUT|PATCH|DELETE) (\/[^\s]+)/g)].map((match) => `${match[1]} ${match[2]}`);
  const matched = covered.filter((operation) => changedOperations.includes(operation));
  if (matched.length && !changedDocs.has(file)) impacted.push({ file, matched });
}

if (!changedOperations.length) {
  console.log('No OpenAPI operation changes detected.');
} else if (!impacted.length) {
  console.log(`Docs impact check passed for: ${changedOperations.join(', ')}`);
} else {
  console.error(`Documentation update required for: ${changedOperations.join(', ')}`);
  for (const { file, matched } of impacted) console.error(`- ${file} covers ${matched.join(', ')}`);
  process.exitCode = 2;
}
