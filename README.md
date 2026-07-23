# Ward Mission Huddle

A phone-friendly Sunday coordination worksheet for ward mission leaders. Runs entirely
in the browser — no login, no accounts, no server. Each leader's roster is saved on
their own device.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `ward-mission-huddle`). It must be **public**
   for free GitHub Pages hosting.
2. Upload every file in this folder to the repository root, preserving the `vendor/`
   subfolder.
3. Go to **Settings → Pages**.
4. Under *Source*, choose **Deploy from a branch**, set branch to `main` and folder to
   `/ (root)`. Save.
5. Wait about a minute. The site goes live at:
   `https://YOUR-USERNAME.github.io/ward-mission-huddle/`

That URL is what you send to the ward mission leaders.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page shell |
| `app.js` | The compiled app (do not edit directly — edit `app.jsx`) |
| `app.jsx` | Readable source, in JSX |
| `build.js` | Compiles `app.jsx` → `app.js` |
| `vendor/` | React libraries, bundled locally so the app doesn't depend on a CDN |
| `sw.js` | Service worker — makes the app work offline |
| `manifest.webmanifest` | Lets phones install it to the home screen |
| `icon-*.png` | App icons |

## Making changes

Edit `app.jsx`, then rebuild:

```bash
npm install @babel/core @babel/preset-react
node build.js
```

Commit both `app.jsx` and the regenerated `app.js`.

**Important:** after any change, bump `CACHE_VERSION` in `sw.js` (e.g. `wmh-v1` →
`wmh-v2`). Otherwise phones that already have the app cached will keep showing the old
version.

## Instructions for ward mission leaders

Send them something like this:

> Open this link on your phone: `https://YOUR-USERNAME.github.io/ward-mission-huddle/`
>
> **Please add it to your home screen** — this matters, it's not just for convenience.
> - **iPhone:** tap the Share button, then "Add to Home Screen"
> - **Android:** tap the ⋮ menu, then "Add to Home screen"
>
> Pick your ward from the dropdown at the top. Your roster saves automatically and will
> be there next Sunday.

## Data and privacy notes

- **Nothing is sent anywhere automatically.** Rosters live only in the browser storage
  of the device they were entered on. The only data that leaves a phone is the summary
  email the leader chooses to send.
- **Add to Home Screen is not optional on iPhone.** iOS Safari clears the site data of
  websites that haven't been opened in about seven days. For a tool used once a week,
  that will eventually wipe a roster. Installing it to the home screen exempts it from
  that cleanup.
- **Use the backup button.** The Summary tab has *Download Backup*, which saves a JSON
  file, and *Restore*, which reads one back in. This is the only recovery path if a
  phone is lost, replaced, or has its browser data cleared. Worth encouraging monthly.
- **The repository is public.** Anyone with the URL can open the tool. That's fine —
  it starts empty for every visitor — but don't commit real names, addresses, or
  anything sensitive into the source. Consider whether you want the default recipient
  email address sitting in a public repo where scrapers will find it; you may prefer to
  leave it blank and have each leader enter it once.
