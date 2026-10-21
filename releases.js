// Public GitHub release metadata only. The static beta.9 links stay in place if the API is unavailable.
(async () => {
  try {
    const response = await fetch('https://api.github.com/repos/Maestrr-app/maestrr-releases/releases?per_page=30', { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) return;
    const releases = (await response.json()).filter(r => !r.draft).sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    const setup = r => r.assets.find(a => /^Maestrr-Setup-.*-win-x64\.exe$/i.test(a.name) && a.state === 'uploaded');
    const official = url => { try { const u = new URL(url); return u.origin === 'https://github.com' && u.pathname.startsWith('/Maestrr-app/maestrr-releases/'); } catch { return false; } };
    const beta = releases.find(r => r.prerelease && setup(r));
    const stable = releases.find(r => !r.prerelease && setup(r));
    const latest = stable || beta;
    if (latest && official(setup(latest).browser_download_url) && official(latest.html_url)) {
      const button = document.getElementById('beta');
      button.href = setup(latest).browser_download_url;
      button.textContent = stable ? 'Télécharger Maestrr' : 'Télécharger la bêta';
      document.getElementById('notes').href = latest.html_url;
      document.getElementById('beta-version').textContent = latest.tag_name.replace(/^v/, '') + (stable ? '' : ' (bêta)');
    }
    if (stable) document.getElementById('stable-status').textContent = beta && new Date(beta.published_at) > new Date(stable.published_at)
      ? 'Une bêta plus récente est disponible : ' + beta.tag_name.replace(/^v/, '') + '.'
      : 'Version stable.';
  } catch { /* Static links remain available without the API. */ }
})();
