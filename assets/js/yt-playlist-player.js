(() => {
    'use strict';

    const SELECTOR = '.ytpp-player';
    let apiLoading = false;
    let apiReady = false;

    function loadYouTubeApi() {
        if (window.YT && window.YT.Player) {
            apiReady = true;
            initializePlayers();
            return;
        }
        if (apiLoading) {
            return;
        }

        apiLoading = true;
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
    }

    function initializePlayers() {
        if (!apiReady && !(window.YT && window.YT.Player)) {
            return;
        }
        document
            .querySelectorAll(SELECTOR)
            .forEach(initializePlayer);
    }

    function initializePlayer(container) {
        if (container.dataset.ytppInitialized === 'true') {
            return;
        }
        const playlistId = container.dataset.playlistId;
        if (!playlistId) {
            console.warn(
                'YouTube Playlist Player: Missing playlist ID.',
                container
            );
            return;
        }

        container.dataset.ytppInitialized = 'true';

        const videoContainer =
            document.createElement('div');

        videoContainer.className =
            'ytpp-player__video';

        const controls =
            document.createElement('div');

        controls.className =
            'ytpp-player__controls';

        const previousButton =
            document.createElement('button');

        previousButton.type = 'button';
        previousButton.className =
            'ytpp-player__previous';

        previousButton.textContent =
            '← Vorheriges Video';

        const position =
            document.createElement('span');

        position.className =
            'ytpp-player__position';

        const nextButton =
            document.createElement('button');

        nextButton.type = 'button';
        nextButton.className =
            'ytpp-player__next';

        nextButton.textContent =
            'Nächstes Video →';

        controls.append(
            previousButton,
            position,
            nextButton
        );

        container.append(
            videoContainer,
            controls
        );

        let player;

        function updatePosition() {
            if (!player) {
                return;
            }

            const playlist = player.getPlaylist();

            const index = player.getPlaylistIndex();

            if (
                Array.isArray(playlist) &&
                playlist.length > 0 &&
                index >= 0
            ) {

                position.textContent =
                    `Video ${index + 1} von ${playlist.length}`;

            } else {

                position.textContent = '';
            }
        }


        player = new YT.Player(
            videoContainer,
            {

                host:
                    'https://www.youtube-nocookie.com',

                playerVars: {

                    listType: 'playlist',

                    list:
                    playlistId,

                    controls: 1

                },

                events: {

                    onReady:
                    updatePosition,

                    onStateChange:
                    updatePosition

                }

            }
        );


        previousButton.addEventListener(
            'click',
            () => {

                player.previousVideo();

                window.setTimeout(
                    updatePosition,
                    250
                );
            }
        );


        nextButton.addEventListener(
            'click',
            () => {

                player.nextVideo();

                window.setTimeout(
                    updatePosition,
                    250
                );
            }
        );
    }


    window.onYouTubeIframeAPIReady =
        function () {

            apiReady = true;

            initializePlayers();
        };


    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            loadYouTubeApi
        );

    } else {

        loadYouTubeApi();
    }

})();
