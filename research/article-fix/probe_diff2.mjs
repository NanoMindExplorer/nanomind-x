import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { scrapeArticleById } from '../../engine/src/scrapers/twitter/http/articles.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
const a = await scrapeArticleById(client, '2118426406657163264');
const w = JSON.parse(fs.readFileSync('/tmp/article_wrapper.json', 'utf8')).data;
console.log('fresh len:', a.text.length, '| wrapper len:', w.text.length, '| identical:', a.text === w.text);
if (a.text !== w.text) {
  let i = 0; while (i < Math.min(a.text.length, w.text.length) && a.text[i] === w.text[i]) i++;
  console.log('first diff at char', i, 'of', Math.min(a.text.length, w.text.length));
  console.log('fresh around diff:', JSON.stringify(a.text.slice(Math.max(0,i-80), i+100)));
  console.log('wrapper around diff:', JSON.stringify(w.text.slice(Math.max(0,i-80), i+100)));
}
