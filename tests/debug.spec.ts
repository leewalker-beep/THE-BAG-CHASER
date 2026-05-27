import { test, expect } from '@playwright/test';

test('debug screenshot', async ({ page }) => {
  const gameState = {
    state: {
      ph: 'PLAYING',
      tab: 'HUB',
      selTier: '0',
      cancelIntro: false,
      pl: { bag: 200000, clout: 50, aura: 30, maxClout: 100, maxAura: 100, mentalHealth: 100, maxMentalHealth: 100, mo: 5, tier: 1 },
      up: { sw: 1, drp: 1, vin: 1, smm: 1, gig: 1, pod: 1, box: 1, tch: 1, crp: 1, tur: 1, hf: 1, mov: 1 },
      news: [],
      flex: { penthouse: { owned: false }, logistics: { owned: false }, jet: { owned: false }, yacht: { owned: false }, media: { owned: false }, foundation: { owned: false }, art: { owned: false }, watch: { owned: false }, car: { owned: false }, archive: { owned: false } }
    },
    version: 1.1
  };

  await page.addInitScript((state) => {
    window.localStorage.setItem('bag-chaser-save-v1', JSON.stringify(state));
  }, gameState);

  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'debug_hub.png' });

  await page.click('[data-testid="tier-nav-0"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'debug_tier0.png' });
});
