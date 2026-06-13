# Levelop Backlink Bot

Auto-generate SEO articles with Claude and publish them to Dev.to and Hashnode in one click.

---

## Deploy to Vercel (5 minutes)

### Step 1 — Get your Anthropic API key
1. Go to https://console.anthropic.com
2. Click **API Keys** → **Create Key**
3. Copy the key (starts with `sk-ant-...`)

### Step 2 — Deploy to Vercel

**Option A: Via Vercel CLI (recommended)**
```bash
npm install -g vercel
cd levelop-backlink-bot
vercel deploy --prod
```
Follow the prompts — pick a project name, default settings are fine.

**Option B: Via GitHub**
1. Push this folder to a GitHub repo
2. Go to https://vercel.com/new
3. Import the repo
4. Click Deploy

### Step 3 — Add your Anthropic API key as an environment variable
1. Go to your project on https://vercel.com/dashboard
2. Click **Settings** → **Environment Variables**
3. Add:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: your key from Step 1
4. Click **Save**
5. Go to **Deployments** → click the three dots on your latest deploy → **Redeploy**

### Step 4 — Open the app
Your app is live at: `https://your-project-name.vercel.app`

---

## How to use

1. Paste your **Dev.to API key** (get it from dev.to → Settings → Extensions)
2. Optionally add your **Hashnode API key** and **publication ID**
3. Enter a topic or click **Suggest** for AI-generated ideas
4. Click **Generate article** — Claude writes a full SEO article with a backlink to levelop.dev
5. Review the article, then click **Publish now**

---

## Files

```
levelop-backlink-bot/
├── api/
│   └── claude.js        # Vercel serverless function — proxies Anthropic API
├── public/
│   └── index.html       # The full app UI
├── vercel.json          # Vercel routing config
└── package.json
```

---

## Notes
- The Anthropic API key lives in Vercel's environment variables — never in the frontend
- Dev.to and Hashnode keys are entered in the UI and sent directly to their APIs from your browser
- Articles are published with `canonical_url` pointing to levelop.dev for SEO benefit
