export {};

Connector.playerSelector = '#react-root';

document.body.insertAdjacentHTML(
	'beforeend',
	'<div id="nts-live-tracklist" style="display: none;"></div>',
);

let live: boolean | null = null;
let artist: string | null = null;
let track: string | null = null;

Connector.isPlaying = () => {
	live = document.querySelector('.live-channel--playing') !== null;
	if (live) {
		return true;
	}
	const showPlaying =
		document.querySelector('.soundcloud-player__play-icon title')
			?.textContent !== 'Play';
	if (showPlaying) {
		return true;
	}
	return false;
};

function loadTracklist() {
	fetch(
		'https://mysterious-journey-91752-edf28ad9f51e.herokuapp.com/https://nts.live/live-tracklist/1',
	)
		.then((res) => res.text())
		.then((text) => {
			const element = document.getElementById('nts-live-tracklist');
			if (element) {
				element.innerHTML = text;
			}
		});
}

Connector.getArtistTrack = () => {
	if (live) {
		artist = document.querySelector(
			'.page-live-tracks__list li:first-child .page-live-tracks__artist-title',
		)?.textContent;
		track = document.querySelector(
			'.page-live-tracks__list li:first-child .page-live-tracks__song-title',
		)?.textContent;
	} else {
		const artistElement = document.querySelector(
			'.episode-player-tracklist__track--is-playing .episode-player-tracklist__artist',
		);
		if (artistElement) {
			artist = artistElement.textContent;
		}
		const trackElement = document.querySelector(
			'.episode-player-tracklist__track--is-playing .episode-player-tracklist__title',
		);
		if (trackElement) {
			track = trackElement.textContent;
		}
	}
	return { artist, track };
};

Connector.scrobbleInfoLocationSelector = live
	? '.live-header__live-now-label'
	: '.soundcloud-player__content';

Connector.scrobbleInfoStyle = {
	...Connector.scrobbleInfoStyle,
	fontSize: '0.5em',
	marginLeft: '2em',
};
