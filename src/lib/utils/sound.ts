import { browser } from '$app/environment';

export type SoundEffect = 'correct' | 'wrong' | 'combo' | 'coin' | 'session_end' | 'button_tap';

const MUTE_KEY = 'classe-master-mute';

/**
 * Sound Manager for game sound effects.
 * Provides play/mute infrastructure. Sound files to be added later.
 */
function createSoundManager() {
	let isMuted = false;
	let volume = 0.7;

	if (browser) {
		isMuted = localStorage.getItem(MUTE_KEY) === 'true';
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function play(effect: SoundEffect): void {
		if (isMuted || !browser) return;
		// Sound files will be added in a future sprint.
		// When added, use: new Audio(`/sounds/${effect}.mp3`).play()
	}

	function mute(): void {
		isMuted = true;
		if (browser) localStorage.setItem(MUTE_KEY, 'true');
	}

	function unmute(): void {
		isMuted = false;
		if (browser) localStorage.setItem(MUTE_KEY, 'false');
	}

	function toggleMute(): boolean {
		if (isMuted) {
			unmute();
		} else {
			mute();
		}
		return isMuted;
	}

	function setVolume(v: number): void {
		volume = Math.max(0, Math.min(1, v));
	}

	function getVolume(): number {
		return volume;
	}

	return {
		get isMuted() {
			return isMuted;
		},
		play,
		mute,
		unmute,
		toggleMute,
		setVolume,
		getVolume
	};
}

export const soundManager = createSoundManager();
