import MarkdownIt from 'markdown-it';
import GithubSlugger from 'github-slugger';

const parser = new MarkdownIt( { html: true } );

export function inspectMarkdown( source ) {
	const tokens = parser.parse( source, {} );
	const slugger = new GithubSlugger();
	const anchors = new Set();
	const explicitIds = [];
	const links = [];
	function visit( token ) {
		if ( token.type === 'link_open' ) links.push( token.attrGet( 'href' ) );
		if ( token.type === 'image' ) links.push( token.attrGet( 'src' ) );
		if ( token.type === 'html_inline' || token.type === 'html_block' ) {
			for ( const match of token.content.matchAll(
				/\bid=["']([^"']+)["']/g
			) ) {
				explicitIds.push( match[ 1 ] );
				anchors.add( match[ 1 ] );
			}
		}
		for ( const child of token.children ?? [] ) visit( child );
	}
	for ( let i = 0; i < tokens.length; i++ ) {
		if ( tokens[ i ].type === 'heading_open' ) {
			const heading = tokens[ i + 1 ].children
				.filter( ( { type } ) =>
					[ 'text', 'code_inline', 'emoji', 'image' ].includes( type )
				)
				.map( ( { content } ) => content )
				.join( '' );
			anchors.add( slugger.slug( heading ) );
		}
		visit( tokens[ i ] );
	}
	return { anchors, explicitIds, links };
}
