export {};

Connector.playerSelector = '#react-root';

let live: boolean | null = null;
let songInfo: {
	artist: string | null;
	track: string | null;
} | null = null;

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

async function requestSongInfo() {
	setInterval(async () => {
		songInfo = await fetchSongInfo();
	}, 10000);
}

async function fetchSongInfo() {
	let artist = null;
	let track = null;
	const response = await Util.fetchFromServiceWorker(
		'https://nts.live/live-tracklist/1',
		'text',
	);
	if (response.ok) {
		const result = response.content;
		const doc = new DOMParser().parseFromString(result, 'text/html');
		const artistElement = doc.querySelector(
			'.page-live-tracks__list li:first-child .page-live-tracks__artist-title',
		);
		if (artistElement) {
			artist = artistElement.textContent;
		}
		const trackElement = doc.querySelector(
			'.page-live-tracks__list li:first-child .page-live-tracks__song-title',
		);
		if (trackElement) {
			track = trackElement.textContent;
		}
	}
	return { artist, track };
}

Connector.getArtistTrack = () => {
	let artist = null;
	let track = null;
	if (live) {
		requestSongInfo();
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
		songInfo = { artist, track };
	}
	return songInfo;
};

Connector.scrobbleInfoLocationSelector = live
	? '.live-header__live-now-label'
	: '.soundcloud-player__content';

Connector.scrobbleInfoStyle = {
	...Connector.scrobbleInfoStyle,
	fontSize: '0.5em',
	marginLeft: '2em',
};
