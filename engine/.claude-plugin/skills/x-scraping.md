# X/Twitter Scraping Skill
<!-- by nichxbt -->

You can scrape X/Twitter data without API access using the nanomind-x MCP tools. All scraping uses Puppeteer stealth browser automation.

## Available Scraping Tools

| Tool | What it scrapes | Key params |
|------|----------------|------------|
| `x_get_profile` | Profile: bio, followers, following, tweets, verified, joined, location, website | `username` |
| `x_get_followers` | Follower list with bios and followsYou indicator | `username`, `limit` (default: 100) |
| `x_get_following` | Following list with followsYou indicator | `username`, `limit` |
| `x_get_tweets` | Recent tweets: text, likes, retweets, replies, timestamp, url | `username`, `limit` |
| `x_search_tweets` | Search results matching a query | `query`, `limit` |
| `x_get_trends` | Current trending topics | — |
| `x_get_explore` | Explore page content | — |
| `x_get_bookmarks` | User's bookmarked tweets | — |
| `x_get_thread` | All tweets in a thread | `tweet_url` |
| `x_get_notifications` | Recent notifications | — |
| `x_get_lists` | User's Twitter lists | `username` |
| `x_get_list_members` | Members of a specific list | `list_id` |
| `x_download_video` | MP4 URLs from a video tweet | `tweet_url` |

## Data Shapes

**Profile:** `{ username, displayName, bio, followers, following, tweets, joined, location, website, verified }`

**Followers/Following:** `[{ username, displayName, bio, followsYou }]`

**Tweets:** `[{ text, likes, retweets, replies, timestamp, url }]`

## Scraping Workflow

1. Authenticate with `x_login` (auth_token cookie)
2. Use read tools to fetch data
3. For large exports, use the CLI: `nanomind-x profile <username> --output json`
4. Always respect rate limits — add delays between requests

## CLI Scraping (Alternative)

nanomind-x also provides a CLI for terminal-based scraping:

```bash
nanomind-x profile <username>          # Profile info
nanomind-x followers <username> -l 50  # First 50 followers
nanomind-x following <username>        # Following list
nanomind-x tweets <username> -l 20    # Recent 20 tweets
nanomind-x search "query" -l 30       # Search tweets
nanomind-x hashtag "#topic" -l 50     # Hashtag tweets
nanomind-x thread <tweet_url>         # Thread unroll
nanomind-x media <username>           # Media posts
```

All CLI commands support `--output json`, `--output csv`, and `--json` flags.

## Export Formats

Data can be exported via CLI flags:
- `--output json` → JSON file
- `--output csv` → CSV file
- `--json` → stdout JSON

For programmatic use: `import { exportToJSON, exportToCSV } from 'nanomind-x'`
