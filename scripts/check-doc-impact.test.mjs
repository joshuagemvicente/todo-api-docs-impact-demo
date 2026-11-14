import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const result = spawnSync(process.execPath, ['scripts/check-doc-impact.mjs', 'fixtures/openapi.before.json', 'openapi.json'], { encoding: 'utf8' });
assert.equal(result.status, 2);
assert.match(result.stderr, /docs\/create-a-todo\.mdx covers POST \/todos/);

const documented = spawnSync(process.execPath, ['scripts/check-doc-impact.mjs', 'fixtures/openapi.before.json', 'openapi.json'], {
  encoding: 'utf8',
  env: { ...process.env, CHANGED_FILES: 'docs/create-a-todo.mdx' },
});
assert.equal(documented.status, 0);
assert.match(documented.stdout, /Docs impact check passed/);
