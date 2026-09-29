import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const roots = ['docs', '.github'].map((path) => join(root, path));
const files = ['README.md', 'ANFORDERUNGEN-UND-UMSETZUNGSPLAN.md']
	.map((path) => join(root, path));

function collectMarkdown(path) {
	if (!existsSync(path)) {
		return;
	}
	if (statSync(path).isDirectory()) {
		for (const entry of readdirSync(path)) {
			collectMarkdown(join(path, entry));
		}
		return;
	}
	if (extname(path) === '.md') {
		files.push(path);
	}
}

for (const path of roots) {
	collectMarkdown(path);
}

const errors = [];
const anchorsByFile = new Map();
const stableIds = new Map();

function headingAnchor(heading) {
	return heading
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s-]/gu, '')
		.trim()
		.replace(/\s+/g, '-');
}

for (const file of files) {
	const source = readFileSync(file, 'utf8');
	const anchors = new Set();
	for (const match of source.matchAll(/<a\s+id=["']([^"']+)["']\s*><\/a>/g)) {
		anchors.add(match[1].toLowerCase());
	}
	for (const match of source.matchAll(/^#{1,6}\s+(.+)$/gm)) {
		anchors.add(headingAnchor(match[1]));
	}
	anchorsByFile.set(file, anchors);

	for (const anchor of anchors) {
		if (!/^(?:rm|idea|fr|man|nfr(?:-priv|-a11y)?)-\d{3}$/.test(anchor)) {
			continue;
		}
		if (stableIds.has(anchor)) {
			errors.push(
				`Duplicate stable ID ${anchor}: ${relative(root, stableIds.get(anchor))} and ${relative(root, file)}`,
			);
		} else {
			stableIds.set(anchor, file);
		}
	}
}

for (const file of files) {
	const source = readFileSync(file, 'utf8');
	for (const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
		const rawTarget = match[1].trim().replace(/^<|>$/g, '');
		if (/^(?:https?:|mailto:)/.test(rawTarget)) {
			continue;
		}
		const [rawPath, rawFragment = ''] = rawTarget.split('#', 2);
		const target = rawPath ? resolve(dirname(file), decodeURI(rawPath)) : file;
		if (!existsSync(target)) {
			errors.push(`${relative(root, file)}: missing ${rawTarget}`);
			continue;
		}
		if (!rawFragment || statSync(target).isDirectory() || extname(target) !== '.md') {
			continue;
		}
		const anchor = decodeURIComponent(rawFragment).toLowerCase();
		if (!anchorsByFile.get(target)?.has(anchor)) {
			errors.push(`${relative(root, file)}: missing anchor ${rawTarget}`);
		}
	}
}

const coverageSource = readFileSync(
	join(root, 'docs/testing/coverage.md'),
	'utf8',
);
for (const stableId of stableIds.keys()) {
	if (/^(?:fr|nfr(?:-priv|-a11y)?)-\d{3}$/.test(stableId)) {
		if (!coverageSource.includes(`#${stableId})`)) {
			errors.push(`Coverage matrix does not reference ${stableId}`);
		}
	}
	if (/^man-\d{3}$/.test(stableId)) {
		if (!coverageSource.includes(`manual-acceptance.md#${stableId}`)) {
			errors.push(`Coverage matrix does not reference ${stableId}`);
		}
	}
}

const versionMatrix = readFileSync(
	join(root, 'docs/development/versions.md'),
	'utf8',
);

function matrixValue(label) {
	const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return versionMatrix.match(
		new RegExp('^\\| ' + escapedLabel + ' \\| `([^`]+)` \\|', 'm'),
	)?.[1];
}

function checkVersion(label, expected, references) {
	const documented = matrixValue(label);
	if (documented !== expected) {
		errors.push(
			`Version matrix ${label}: expected ${expected}, found ${documented ?? 'no value'}`,
		);
	}
	for (const [name, value] of references) {
		if (value !== expected) {
			errors.push(`${name}: expected ${expected}, found ${value ?? 'no value'}`);
		}
	}
}

function capture(source, pattern) {
	return source.match(pattern)?.[1];
}

function minimum(versionRange) {
	return versionRange?.replace(/^[<>=~^\s]+/, '');
}

const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const composerJson = JSON.parse(readFileSync(join(root, 'composer.json'), 'utf8'));
const wpEnv = JSON.parse(readFileSync(join(root, '.wp-env.json'), 'utf8'));
const wpEnvTest = JSON.parse(
	readFileSync(join(root, '.wp-env.test.json'), 'utf8'),
);
const ciWorkflow = readFileSync(join(root, '.github/workflows/ci.yml'), 'utf8');
const releaseWorkflow = readFileSync(
	join(root, '.github/workflows/release.yml'),
	'utf8',
);
const composerScript = readFileSync(join(root, 'scripts/composer.sh'), 'utf8');
const localTests = readFileSync(join(root, 'scripts/local-tests.sh'), 'utf8');
const pluginHeader = readFileSync(join(root, 'yt-playlist-player.php'), 'utf8');
const pluginReadme = readFileSync(join(root, 'readme.txt'), 'utf8');
const qualityRequirements = readFileSync(
	join(root, 'docs/requirements/quality.md'),
	'utf8',
);
const platformDecision = readFileSync(
	join(
		root,
		'docs/architecture/decisions/0002-minimum-wordpress-and-dynamic-rendering.md',
	),
	'utf8',
);

const wordpressMinimum = capture(pluginHeader, /Requires at least:\s*([^\s*]+)/);
checkVersion('Supported WordPress minimum', wordpressMinimum, [
	['readme.txt WordPress minimum', capture(pluginReadme, /Requires at least:\s*(\S+)/)],
	[
		'NFR-001 WordPress minimum',
		capture(qualityRequirements, /minimum platform is WordPress ([\d.]+)/),
	],
	[
		'ADR 0002 WordPress minimum',
		capture(platformDecision, /Require WordPress ([\d.]+)/),
	],
]);

const phpMinimum = minimum(composerJson.require.php);
checkVersion('Supported PHP minimum', phpMinimum, [
	[
		'composer.json PHP platform',
		minimum(composerJson.config.platform.php).split('.').slice(0, 2).join('.'),
	],
	['plugin header PHP minimum', capture(pluginHeader, /Requires PHP:\s*([^\s*]+)/)],
	['readme.txt PHP minimum', capture(pluginReadme, /Requires PHP:\s*(\S+)/)],
	[
		'NFR-001 PHP minimum',
		capture(
			qualityRequirements,
			/minimum platform is WordPress [\d.]+ and PHP (\d+\.\d+)/,
		),
	],
	['ADR 0002 PHP minimum', capture(platformDecision, /Require PHP ([\d.]+)/)],
]);

const nodeMinimum = minimum(packageJson.engines.node);
checkVersion('Node.js minimum and CI selection', nodeMinimum, [
	['CI Node.js version', capture(ciWorkflow, /NODE_VERSION:\s*'([^']+)'/)],
	[
		'Release Node.js version',
		capture(releaseWorkflow, /NODE_VERSION:\s*'([^']+)'/),
	],
]);

checkVersion('npm minimum', minimum(packageJson.engines.npm), []);

const composerVersion = capture(
	composerScript,
	/COMPOSER_IMAGE='composer:([^']+)'/,
);
const composerFixtureReferences = [
	'tests/accessibility/player.pw.js',
	'tests/responsive/layout.pw.js',
].flatMap((path) =>
	[...readFileSync(join(root, path), 'utf8').matchAll(/composer:([\d.]+)/g)].map(
		(match, index) => [`${path} Composer reference ${index + 1}`, match[1]],
	),
);
checkVersion('Composer', composerVersion, [
	['CI Composer version', capture(ciWorkflow, /tools:\s*composer:(\S+)/)],
	...composerFixtureReferences,
]);

const playwrightVersion = packageJson.devDependencies['@playwright/test'];
checkVersion('Playwright', playwrightVersion, [
	[
		'local-tests.sh Playwright version',
		capture(localTests, /playwright_version="([^"]+)"/),
	],
]);

checkVersion('Daily PHP', wpEnv.phpVersion, []);
checkVersion(
	'Integration WordPress',
	capture(wpEnvTest.core, /#([\d.]+)-branch$/),
	[],
);
checkVersion('Integration PHP', wpEnvTest.phpVersion, []);

const phpMatrix = capture(ciWorkflow, /php:\s*\[([^\]]+)\]/)
	?.match(/['"]([^'"]+)['"]/g)
	?.map((value) => value.slice(1, -1))
	.join(', ');
checkVersion('CI PHP matrix', phpMatrix, []);

const ciRunners = [
	...ciWorkflow.matchAll(/^\s*runs-on:\s*(\S+)/gm),
	...releaseWorkflow.matchAll(/^\s*runs-on:\s*(\S+)/gm),
].map((match) => match[1]);
const githubRunner = ciRunners[0];
checkVersion(
	'GitHub runner',
	githubRunner,
	ciRunners.map((runner, index) => [`Workflow runner ${index + 1}`, runner]),
);

if (wpEnv.core !== null) {
	errors.push('.wp-env.json: Daily WordPress must select the current release');
}

if (errors.length > 0) {
	console.error(errors.join('\n'));
	process.exitCode = 1;
} else {
	console.log(`Documentation check passed (${files.length} Markdown files, ${stableIds.size} stable IDs).`);
}
