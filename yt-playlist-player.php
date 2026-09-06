<?php

/**
 * Plugin Name:       YouTube Playlist Player
 * Description:       Adds an enhanced navigation interface to embedded YouTube playlists.
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            quasipapa
 * Copyright:         2026 quasipapa
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Text Domain:       yt-playlist-player
 * Update URI:        https://github.com/quasipapa/youtube-player
 */

defined('ABSPATH') || exit;

define(
    'YTPP_VERSION',
    '0.1.0'
);

define(
    'YTPP_PLUGIN_URL',
    plugin_dir_url(__FILE__)
);


function ytpp_enqueue_assets(): void
{
    wp_enqueue_style(
        'ytpp-player',
        YTPP_PLUGIN_URL . 'assets/css/yt-playlist-player.css',
        [],
        YTPP_VERSION
    );

    wp_enqueue_script(
        'ytpp-player',
        YTPP_PLUGIN_URL . 'assets/js/yt-playlist-player.js',
        [],
        YTPP_VERSION,
        [
            'in_footer' => true,
            'strategy'  => 'defer',
        ]
    );
}

add_action(
    'wp_enqueue_scripts',
    'ytpp_enqueue_assets'
);
