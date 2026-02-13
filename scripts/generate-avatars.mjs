#!/usr/bin/env node
/**
 * One-time script to generate pixel art avatars via Gemini image generation.
 * Run: node scripts/generate-avatars.mjs
 * Requires: GEMINI_API_KEY environment variable
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AVATARS_DIR = path.join(__dirname, '..', 'static', 'avatars');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
	console.error('Error: GEMINI_API_KEY environment variable is required');
	process.exit(1);
}

const characters = [
	{ id: 1, name: 'lion', desc: 'a cute friendly lion with a fluffy mane' },
	{ id: 2, name: 'frog', desc: 'a happy smiling green frog' },
	{ id: 3, name: 'fox', desc: 'a clever orange fox with a bushy tail' },
	{ id: 4, name: 'owl', desc: 'a wise brown owl with big round eyes' },
	{ id: 5, name: 'cat', desc: 'a playful orange tabby cat' },
	{ id: 6, name: 'dragon', desc: 'a small cute baby dragon with tiny wings' },
	{ id: 7, name: 'unicorn', desc: 'a magical pink unicorn with a rainbow horn' },
	{ id: 8, name: 'robot', desc: 'a friendly blue robot with antenna and glowing eyes' },
	{ id: 9, name: 'panda', desc: 'a round cute panda bear eating bamboo' },
	{ id: 10, name: 'astronaut', desc: 'a cute astronaut in a round space helmet' }
];

async function generateAvatar(character) {
	const prompt = `Create a 128x128 pixel art character portrait of ${character.desc}. Style: retro pixel art, vibrant colors, cute kawaii face, simple design, facing forward, centered, solid colored background (light pastel). No text, no watermark.`;

	const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;

	const body = {
		contents: [
			{
				parts: [{ text: prompt }]
			}
		],
		generationConfig: {
			responseModalities: ['TEXT', 'IMAGE']
		}
	};

	console.log(`Generating avatar ${character.id}: ${character.name}...`);

	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		const text = await response.text();
		console.error(`Failed for ${character.name}: ${response.status} ${text}`);
		return false;
	}

	const data = await response.json();

	// Find the image part in the response
	const candidates = data.candidates || [];
	for (const candidate of candidates) {
		const parts = candidate.content?.parts || [];
		for (const part of parts) {
			if (part.inlineData?.mimeType?.startsWith('image/')) {
				const imageData = Buffer.from(part.inlineData.data, 'base64');
				const ext = part.inlineData.mimeType === 'image/png' ? 'png' : 'png';
				const filename = `avatar-${character.id}.${ext}`;
				const filepath = path.join(AVATARS_DIR, filename);
				fs.writeFileSync(filepath, imageData);
				console.log(`  Saved: ${filename} (${imageData.length} bytes)`);
				return true;
			}
		}
	}

	console.error(`  No image found in response for ${character.name}`);
	return false;
}

async function main() {
	fs.mkdirSync(AVATARS_DIR, { recursive: true });

	let success = 0;
	let failed = 0;

	for (const character of characters) {
		try {
			const ok = await generateAvatar(character);
			if (ok) success++;
			else failed++;
		} catch (err) {
			console.error(`  Error for ${character.name}:`, err.message);
			failed++;
		}
		// Rate limit: wait 2s between requests
		await new Promise((r) => setTimeout(r, 2000));
	}

	console.log(`\nDone: ${success} generated, ${failed} failed`);
}

main().catch(console.error);
