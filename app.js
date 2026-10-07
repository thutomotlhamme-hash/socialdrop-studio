// Change the brand name in one place.
const BRAND = 'Dishdrop';

document.querySelectorAll('[data-brand-name]').forEach((el) => { el.textContent = BRAND; });
document.getElementById('yr').textContent = new Date().getFullYear();

// Demo recipes shown by the hero "drop" form. A real import would call a backend
// that fetches the link and extracts the recipe.
const SAMPLES = [
  {
    emoji: '🍜', title: 'Chilli Garlic Noodles', time: '15 min', serves: 2,
    ingredients: ['200g egg noodles', '4 garlic cloves, minced', '2 tbsp chilli oil', '2 tbsp soy sauce', '1 tsp sugar', '2 spring onions'],
    steps: ['Boil noodles until just tender.', 'Fry garlic in chilli oil for 30 sec.', 'Stir in soy and sugar.', 'Toss noodles through, top with spring onion.'],
  },
  {
    emoji: '🍗', title: 'Peri-Peri Chicken Traybake', time: '45 min', serves: 4,
    ingredients: ['8 chicken thighs', '3 tbsp peri-peri sauce', '500g baby potatoes', '1 red onion', '1 lemon', 'Fresh parsley'],
    steps: ['Heat oven to 200°C.', 'Toss everything with peri-peri sauce.', 'Roast 40 min, turning once.', 'Finish with lemon and parsley.'],
  },
];

const SAMPLE_URL = 'https://www.tiktok.com/@homecook/video/7301234567890';

function sourceFrom(url) {
  const host = (() => { try { return new URL(url).hostname; } catch { return ''; } })();
  const map = { tiktok: 'TikTok', instagram: 'Instagram', youtube: 'YouTube', youtu: 'YouTube', pinterest: 'Pinterest', facebook: 'Facebook' };
  const hit = Object.keys(map).find((k) => host.includes(k));
  return hit ? map[hit] : host.replace(/^www\./, '') || 'Web';
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const card = document.getElementById('card');
let sampleIdx = 0;

function renderRecipe(r, url) {
  card.innerHTML = `
    <article class="card">
      <div class="card__img">${r.emoji}</div>
      <div class="card__body">
        <span class="card__src">From ${escapeHtml(sourceFrom(url))}</span>
        <h3>${r.title}</h3>
        <div class="card__meta"><span>⏱ ${r.time}</span><span>🍽 Serves ${r.serves}</span></div>
        <h4>Ingredients</h4>
        <ul>${r.ingredients.map((i) => `<li>${i}</li>`).join('')}</ul>
        <h4>Method</h4>
        <ol>${r.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      </div>
    </article>`;
}

document.getElementById('dropForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const url = document.getElementById('dropUrl').value.trim();
  card.innerHTML = '<div class="loading"><div class="spinner"></div>Reading recipe…</div>';
  const recipe = SAMPLES[sampleIdx++ % SAMPLES.length];
  setTimeout(() => renderRecipe(recipe, url), 1200);
});

document.querySelector('[data-sample]').addEventListener('click', () => {
  document.getElementById('dropUrl').value = SAMPLE_URL;
  document.getElementById('dropForm').requestSubmit();
});

// Mobile download banner, dismissible and remembered per browser.
const banner = document.getElementById('banner');
let dismissed = false;
try { dismissed = localStorage.getItem('bannerDismissed') === '1'; } catch {}
if (!dismissed) banner.hidden = false;
banner.querySelector('.banner__x').addEventListener('click', () => {
  banner.hidden = true;
  try { localStorage.setItem('bannerDismissed', '1'); } catch {}
});
