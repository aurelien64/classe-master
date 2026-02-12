import { describe, it, expect } from 'vitest';

describe('test infrastructure', () => {
	it('should run a basic test', () => {
		expect(1 + 1).toBe(2);
	});

	it('should support async tests', async () => {
		const result = await Promise.resolve(42);
		expect(result).toBe(42);
	});
});
