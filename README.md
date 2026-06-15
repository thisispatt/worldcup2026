# ⚽ World Cup 2026 Office Sweepstakes

A free, modern web app for your office World Cup sweepstakes — hosted on GitHub Pages (no cost, no server needed).

---

## 🚀 Setup Guide (no coding experience needed)

### Step 1 — Create a free GitHub account
Go to [github.com](https://github.com) and sign up for a free account if you don't have one.

### Step 2 — Create a new repository
1. Click the **+** icon (top-right) → **New repository**
2. Name it exactly: `worldcup-sweepstakes`
3. Make it **Public** (required for free GitHub Pages)
4. Click **Create repository**

### Step 3 — Upload the files
You need to recreate this exact folder structure in your repository.
The easiest way is to use GitHub's web editor:

1. In your new repository, click **Add file** → **Create new file**
2. Create each file listed below by typing the filename and pasting the contents

**Files to create:**
```
index.html
package.json
vite.config.js
src/main.jsx
src/App.jsx
src/index.css
src/data.js                        ← THE FILE YOU EDIT TO UPDATE THE APP
src/components/Sweepstakes.jsx
src/components/Groups.jsx
src/components/Fixtures.jsx
src/components/Bracket.jsx
src/components/Prize.jsx
.github/workflows/deploy.yml
```

> 💡 **Tip for nested folders**: When creating a file in a subfolder, type the full path in the filename box, e.g. `src/components/Sweepstakes.jsx` — GitHub will create the folders automatically.

### Step 4 — Enable GitHub Pages
1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

### Step 5 — Trigger the first build
Any time you save (commit) a file, the site automatically rebuilds.
After your first commit, wait ~2 minutes then visit:

```
https://YOUR-USERNAME.github.io/worldcup-sweepstakes/
```

---

## ✏️ How to update the app

**Everything lives in `src/data.js`** — you only ever need to edit that one file.

### Add colleague names
Find the `entries` array and replace `"TBD"` with real names:
```js
{ name: "Sarah Murphy", team: "Ireland" },
```

### Update group table standings
After each match, update the `won`, `drawn`, `lost`, `gf`, `ga` numbers in the `groups` object:
```js
{ name: "France", flag: "🇫🇷", played: 2, won: 1, drawn: 1, lost: 0, gf: 3, ga: 1, status: "active" }
```

### Mark results in fixtures
Find the fixture and set the scores and `played: true`:
```js
{ id: 49, group: "I", date: "14 Jun", home: "France", away: "Senegal", score1: 2, score2: 0, played: true },
```

### Update team status (active / eliminated / champion / runner-up / third)
Change the `status` field on any team in the `groups` object:
```js
{ name: "France", ..., status: "eliminated" }
```
Or use the `teamStatus` override map at the bottom of `data.js` for knockout stage:
```js
export const teamStatus = {
  "France": "champion",
  "Spain": "runner-up",
  "Argentina": "third",
};
```

### Fill in the knockout bracket
Edit the `knockout` object — add team names as they qualify:
```js
{ id: "r32-1", home: "France", away: "Mexico", score1: 3, score2: 0, played: true, date: "28 Jun" },
```

---

## 💡 Tips
- Every time you edit and save a file on GitHub, the site rebuilds automatically (takes ~2 min)
- The URL never changes — just share it once and colleagues can bookmark it
- Works on mobile too!

---

## 📁 Project structure
```
worldcup-sweepstakes/
├── index.html                  HTML shell
├── package.json                Dependencies
├── vite.config.js              Build config
├── .github/workflows/          Auto-deploy on push
└── src/
    ├── data.js                 ← EDIT THIS FILE
    ├── main.jsx                App entry point
    ├── App.jsx                 Navigation shell
    ├── index.css               All styling
    └── components/
        ├── Sweepstakes.jsx     Colleagues & teams tab
        ├── Groups.jsx          Group tables tab
        ├── Fixtures.jsx        Match results tab
        ├── Bracket.jsx         Knockout bracket tab
        └── Prize.jsx           Prize pot tab
```
