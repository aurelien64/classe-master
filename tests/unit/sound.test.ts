import { describe, it, expect } from 'vitest';
import { soundManager } from '$lib/utils/sound';

describe('soundManager', () => {
	it('starts unmuted', () => {
		expect(soundManager.isMuted).toBe(false);
	});

	it('can mute and unmute', () => {
		soundManager.mute();
		expect(soundManager.isMuted).toBe(true);
		soundManager.unmute();
		expect(soundManager.isMuted).toBe(false);
	});

	it('toggleMute switches state', () => {
		soundManager.unmute();
		soundManager.toggleMute();
		expect(soundManager.isMuted).toBe(true);
		soundManager.toggleMute();
		expect(soundManager.isMuted).toBe(false);
	});

	it('has default volume of 0.7', () => {
		expect(soundManager.getVolume()).toBe(0.7);
	});

	it('clamps volume between 0 and 1', () => {
		soundManager.setVolume(1.5);
		expect(soundManager.getVolume()).toBe(1);
		soundManager.setVolume(-0.5);
		expect(soundManager.getVolume()).toBe(0);
		soundManager.setVolume(0.7);
	});

	it('play does not throw when muted', () => {
		soundManager.mute();
		expect(() => soundManager.play('correct')).not.toThrow();
		soundManager.unmute();
	});

	it('play does not throw when unmuted', () => {
		soundManager.unmute();
		expect(() => soundManager.play('wrong')).not.toThrow();
	});
});
