// Plain Node test — no dependencies. Run with: node test/statusline.test.mjs
// It imports the mod directly (Node strips the types) and exercises the pure helpers, so the
// sub-agent segment and the agent-config parsing are verified without a live cmdc.
import assert from 'node:assert/strict';
import {mkdirSync, mkdtempSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {agentModelFromMarkdown, composeLine, formatTokens, readAgentModels} from '../index.ts';

const SEGMENTS = {
	model: true,
	effort: true,
	context: true,
	bar: true,
	percent: true,
	cache: true,
	cost: true,
	speed: true,
	sub: true,
	name: true,
	git: true,
	cwd: true,
};
const OPTIONS = {color: false, rawModel: true, mode: 'ascii', barWidth: 8, maxWidth: 0, cwd: 'proj'};
const SNAPSHOT = {
	isRepo: false,
	ahead: 0,
	behind: 0,
	staged: 0,
	modified: 0,
	untracked: 0,
	costUsd: 0,
	subTokens: 12400,
};

const tokens = formatTokens(12400);

// 1) sub-agent segment: type + pinned model + tokens
const withModel = composeLine(
	{...SNAPSHOT, subType: 'explore', subModel: 'claude-haiku-4-5'},
	SEGMENTS,
	{...OPTIONS, rawModel: false},
);
assert.ok(withModel.includes('sub explore'), `expected the agent type in: ${withModel}`);
assert.ok(withModel.includes('haiku'), `expected the pinned model in: ${withModel}`);
assert.ok(withModel.includes(tokens), `expected the token count in: ${withModel}`);

// 2) no pinned model (the common case: the agent inherits the session model) -> type + tokens only
const inherit = composeLine({...SNAPSHOT, subType: 'explore'}, SEGMENTS, OPTIONS);
assert.ok(inherit.includes(`sub explore ${tokens}`), `expected "sub explore ${tokens}" in: ${inherit}`);

// 3) no agent type at all -> unchanged legacy behaviour
const legacy = composeLine(SNAPSHOT, SEGMENTS, OPTIONS);
assert.ok(legacy.includes(`sub ${tokens}`), `expected "sub ${tokens}" in: ${legacy}`);

// 4) agent frontmatter: a pinned model is parsed, `inherit` / missing / no frontmatter is not
assert.equal(agentModelFromMarkdown('---\nname: explore\nmodel: claude-haiku-4-5\n---\nbody'), 'claude-haiku-4-5');
assert.equal(agentModelFromMarkdown('---\nmodel: "claude-sonnet-5"\n---\n'), 'claude-sonnet-5');
assert.equal(agentModelFromMarkdown('---\nmodel: inherit\n---\n'), undefined);
assert.equal(agentModelFromMarkdown('---\nmodel: INHERIT\n---\n'), undefined);
assert.equal(agentModelFromMarkdown('---\nname: reviewer\n---\n'), undefined);
assert.equal(agentModelFromMarkdown('no frontmatter here'), undefined);

// 5) readAgentModels reads <project>/.commandcode/agents and indexes by file name and `name:`
const project = mkdtempSync(join(tmpdir(), 'statusline-test-'));
mkdirSync(join(project, '.commandcode', 'agents'), {recursive: true});
writeFileSync(
	join(project, '.commandcode', 'agents', 'zz-pinned.md'),
	'---\nname: zz-pinned\nmodel: claude-haiku-4-5\n---\nprompt body\n',
);
writeFileSync(join(project, '.commandcode', 'agents', 'zz-inherit.md'), '---\nname: zz-inherit\nmodel: inherit\n---\n');
const models = readAgentModels(project);
assert.equal(models['zz-pinned'], 'claude-haiku-4-5');
assert.equal(models['zz-inherit'], undefined);

console.log('ok - statusline tests passed');
