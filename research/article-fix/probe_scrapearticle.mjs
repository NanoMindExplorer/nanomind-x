// Test the canonical scrapers/http scrapeArticleById (uses client.graphql with fieldToggles).
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { scrapeArticleById } from '../../engine/src/scrapers/twitter/http/articles.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
const art = await scrapeArticleById(client, '2118426406657163264');
console.log('ok:', art.kind === 'article', '| title:', art.title, '| author:', JSON.stringify(art.author), '| text:', art.text.length, 'chars,', art.blocks.length, 'blocks | urls:', art.urls.length);
