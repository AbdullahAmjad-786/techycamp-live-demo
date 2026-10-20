const express = require('express');
const os = require('os');
const message = require('./message');

const app = express();

// Build information. The pipeline injects these into the Docker image,
// so the page can prove WHICH version of the code is running.
const info = {
  version: (process.env.GIT_SHA || 'local').slice(0, 7),
  builtAt: process.env.BUILD_TIME || 'not built yet',
  runningOn: process.env.RUNNING_ON || (process.env.GIT_SHA ? 'Docker container' : 'My laptop'),
  host: os.hostname(),
  startedAt: new Date().toISOString(),
};

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Health check: used by Docker and Azure to ask "are you alive?"
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Small API so we can show "the app is just a program answering requests"
app.get('/api/info', (req, res) => {
  res.status(200).json({ ...message, ...info });
});

app.get('/', (req, res) => {
  res.status(200).send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TechyCamp Live Demo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Manrope:wght@400;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root { --paper:#f4f3ec; --ink:#18181f; --muted:#5a5c66; --indigo:#3b3fe0; --violet:#7c3aed; --coral:#fb5a36; --emerald:#0e7a55; --card:#fff; }
    * { box-sizing: border-box; }
    body { margin:0; min-height:100vh; background:var(--paper); color:var(--ink); font-family:Manrope, Arial, sans-serif; display:flex; flex-direction:column; }
    header { padding:20px 24px; display:flex; justify-content:space-between; align-items:center; max-width:1000px; width:100%; margin:0 auto; }
    .logo { font-family:'Space Grotesk', Arial, sans-serif; font-weight:700; font-size:22px; letter-spacing:-0.5px; }
    .logo span { color:var(--indigo); }
    .live { display:inline-flex; align-items:center; gap:8px; background:#fff; border:1px solid #0000001a; padding:6px 12px; border-radius:999px; font-size:14px; font-weight:600; }
    .dot { width:9px; height:9px; border-radius:50%; background:#34c796; box-shadow:0 0 0 4px #34c79633; }
    main { flex:1; max-width:1000px; width:100%; margin:0 auto; padding:24px; display:flex; flex-direction:column; justify-content:center; }
    .kicker { font-family:'JetBrains Mono', monospace; color:var(--indigo); font-size:14px; letter-spacing:1px; text-transform:uppercase; }
    h1 { font-family:'Space Grotesk', Arial, sans-serif; font-size:clamp(36px, 7vw, 76px); line-height:1.05; letter-spacing:-2px; margin:12px 0 16px;
         background:linear-gradient(100deg, var(--indigo), var(--violet) 50%, var(--coral)); -webkit-background-clip:text; background-clip:text; color:transparent; }
    p.sub { font-size:20px; color:var(--muted); margin:0 0 40px; max-width:640px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px; }
    .card { background:var(--card); border:1px solid #00000014; border-radius:18px; padding:18px 20px; }
    .label { font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--muted); font-weight:600; }
    .value { font-family:'JetBrains Mono', monospace; font-size:18px; margin-top:6px; word-break:break-all; }
    footer { text-align:center; padding:20px; color:var(--muted); font-size:14px; }
    footer a { color:var(--indigo); font-weight:600; text-decoration:none; }
  </style>
</head>
<body>
  <header>
    <div class="logo">Techy<span>Camp</span></div>
    <div class="live"><span class="dot"></span> Live</div>
  </header>
  <main>
    <div class="kicker">// DevOps live demo</div>
    <h1>${escapeHtml(message.headline)}</h1>
    <p class="sub">${escapeHtml(message.subtext)}</p>
    <div class="grid">
      <div class="card"><div class="label">Version (git commit)</div><div class="value">${escapeHtml(info.version)}</div></div>
      <div class="card"><div class="label">Running on</div><div class="value">${escapeHtml(info.runningOn)}</div></div>
      <div class="card"><div class="label">Built at</div><div class="value">${escapeHtml(info.builtAt)}</div></div>
      <div class="card"><div class="label">Container name</div><div class="value">${escapeHtml(info.host)}</div></div>
    </div>
  </main>
  <footer>Learn to build this yourself: <a href="https://www.techycamp.com/courses/devops-fundamentals">DevOps for Beginners at TechyCamp</a></footer>
</body>
</html>`);
});

module.exports = app;
