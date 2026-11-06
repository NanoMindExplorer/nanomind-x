import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { scrapeArticleById } from '../../engine/src/scrapers/twitter/http/articles.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
const a1 = await scrapeArticleById(client, '2118426406657163264');
const a2 = await scrapeArticleById(client, '2118426406657163264');
console.log('call1 len:', a1.text.length, '| call2 len:', a2.text.length, '| identical:', a1.text === a2.text);
if (a1.text !== a2.text) {
  let i = 0; while (i < Math.min(a1.text.length, a2.text.length) && a1.text[i] === a2.text[i]) i++;
  console.log('first diff at char', i);
  console.log('call1 around diff:', JSON.stringify(a1.text.slice(Math.max(0,i-60), i+120)));
  console.log('call2 around diff:', JSON.stringify(a2.text.slice(Math.max(0,i-60), i+120)));
}
