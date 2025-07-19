const fs = require('fs');
const path = require('path');
const process = require('process');

const generateHTML = async (dir) => {
  const title = path.basename(dir).replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const cover = 'cover.jpg';
  const descriptionPath = path.join(dir, 'description.md');
  const tracklistPath = path.join(dir, 'tracklist.txt');
  const tagsPath = path.join(dir, 'tags.json');
  const tracksDir = path.join(dir, 'tracks');
  const output = path.join(dir, 'index.html');

  const description = fs.existsSync(descriptionPath)
    ? fs.readFileSync(descriptionPath, 'utf-8')
    : 'No description provided.';

  const tags = fs.existsSync(tagsPath)
    ? JSON.parse(fs.readFileSync(tagsPath, 'utf-8'))
    : { genre: 'Unknown', tags: [] };

  const tracklist = fs.existsSync(tracklistPath)
    ? fs.readFileSync(tracklistPath, 'utf-8').split('\n').filter(Boolean)
    : [];

  const audioPlayers = tracklist.map(track => {
    return `
    <div class="track">
      <strong>${track}</strong>
      <audio controls src="tracks/${track}"></audio>
    </div>`;
  }).join('\n');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} – BACHI</title>
  <link rel="stylesheet" href="/styles/darkmode.css">
  <style>
    body { font-family: monospace; background: #0a0a0a; color: #eee; padding: 2rem; max-width: 960px; margin: auto; }
    h1 { color: #ff00ff; text-shadow: 0 0 10px #ff00ff80; }
    .cover { width: 100%; max-height: 400px; object-fit: contain; margin-bottom: 2rem; }
    .track { margin: 1rem 0; }
    audio { width: 100%; margin-top: 0.5rem; }
    .tags { background-color: #111; padding: 1rem; margin-top: 2rem; border-left: 4px solid #0ff; }
    .download { display: inline-block; margin-top: 2rem; padding: 1rem 2rem; background: #0ff; color: #000; text-decoration: none; font-weight: bold; border-radius: 5px; }
  </style>
</head>
<body>

  <h1>${title}</h1>
  <img src="cover.jpg" alt="LP Cover" class="cover" />

  <section class="description">
    <p>${description.replace(/\n/g, '<br>')}</p>
  </section>

  <section class="tracklist">
    <h2>Tracklist</h2>
    ${audioPlayers}
  </section>

  <section class="tags">
    <p><strong>Genre:</strong> ${tags.genre}</p>
    <p><strong>Tags:</strong> ${tags.tags.join(', ')}</p>
  </section>

  <a class="download" href="release.zip" download>Download full LP</a>

</body>
</html>`.trim();

  fs.writeFileSync(output, html);
  console.log(`✅ Release-Seite erfolgreich generiert: ${output}`);
};

const inputDir = process.argv[2];
if (!inputDir) {
  console.error("❌ Bitte gib ein Verzeichnis an. Beispiel: node generateReleasePage.js releases/my-next-lp");
  process.exit(1);
}
generateHTML(inputDir);
