---
name: account-tools
description: Miscellaneous account utilities — view join date, login history, connected accounts, appeal suspension, QR code sharing, share/embed tweets, upload contacts, and calculate account age. Use when users need account info tools not covered by other skills.
license: Apache-2.0
metadata:
  author: nichxbt
  version: "1.0"
---

# Account Tools (Miscellaneous)

Browser console scripts for account utility tasks on X/Twitter.

## Script Selection

| Goal | File | Navigate to |
|------|------|-------------|
| View join date, login history, connected accounts | `src/accountMisc.js` | `x.com` |
| Appeal account suspension | `src/accountMisc.js` | `x.com` |
| Calculate account age | `src/accountMisc.js` | `x.com/USERNAME` |
| Generate QR code for a profile/tweet | `src/qrCodeSharing.js` | Any page |
| Share or embed a tweet | `src/shareEmbed.js` | Tweet page |
| Upload contacts for people discovery | `src/uploadContacts.js` | `x.com` |

## accountMisc.js — Available Functions

```js
nanomind-x.accountMisc.viewJoinDate('username')       // Scrape join date from profile
nanomind-x.accountMisc.viewLoginHistory()             // View active sessions (device, location, IP)
nanomind-x.accountMisc.viewConnectedAccounts()        // View linked external accounts (Google, Apple)
nanomind-x.accountMisc.appealSuspension()             // Navigate to account appeal/support page
nanomind-x.accountMisc.exportAccountSummary()         // Export account data as JSON
nanomind-x.accountMisc.accountAgeCalculator('user')   // Calculate account age in days/months/years
```

## qrCodeSharing.js — Usage

```js
// Generates a QR code for any X profile or tweet URL
nanomind-x.qr.generateProfile('username')   // QR code for @username's profile
nanomind-x.qr.generateTweet('tweetUrl')     // QR code for a specific tweet
nanomind-x.qr.download()                     // Download as PNG
```

## shareEmbed.js — Usage

```js
// On a tweet page:
nanomind-x.share.copyLink()               // Copy tweet URL to clipboard
nanomind-x.share.getEmbedCode()           // Get HTML embed code for the tweet
nanomind-x.share.openShare()              // Open X's native share menu
```

## uploadContacts.js — Usage

Uploads phone contacts to X for "People you may know" discovery. Navigate to `x.com/settings/contacts` and paste the script.

## Notes

- `viewLoginHistory()` requires navigating to `x.com/settings/sessions`
- `viewConnectedAccounts()` requires navigating to `x.com/settings/connected_accounts`
- `appealSuspension()` navigates to `x.com/help/contact` with suspension-related form pre-filled
- QR codes are generated client-side using a canvas element — no third-party service used
- Contact upload is for discovery only; X encrypts contacts for matching

## Related Skills

- **profile-management** — Edit your profile, bio, avatar
- **settings-privacy** — Configure privacy settings
- **account-backup** — Export your full account data
