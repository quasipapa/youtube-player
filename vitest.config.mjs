import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const styleMock = fileURLToPath(
	new URL( './tests/vitest/style-mock.js', import.meta.url )
);

export default defineConfig( {
	plugins: [
		{
			name: 'ytpp-style-mock',
			enforce: 'pre',
			resolveId( id ) {
				if ( /\.(scss|css)$/.test( id ) ) {
					return styleMock;
				}
				return null;
			},
		},
	],
	oxc: {
		include: /\/(src|assets|tests)\/.*\.[jt]sx?$/,
		exclude: /\/node_modules\//,
		jsx: { runtime: 'automatic' },
	},
	test: {
		environment: 'jsdom',
		server: {
			deps: {
				// Inline WordPress packages so vi.mock() applies to their
				// named exports in test files as well.
				inline: [ /@wordpress\// ],
			},
		},
		setupFiles: [ './tests/vitest/setup.js' ],
		include: [ 'src/**/*.test.{js,jsx}', 'assets/js/**/*.test.{js,jsx}' ],
		exclude: [
			'**/node_modules/**',
			'**/build/**',
			'**/dist/**',
			'**/vendor/**',
			'**/test-results/**',
		],
	},
} );
