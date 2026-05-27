import { test, expect } from '@playwright/test';

test('audio syndicate overhaul verification', async ({ page }) => {
  const gameState = {
    state: {
      ph: 'PLAYING',
      tab: 'AUDIO',
      selTier: '1',
      cancelIntro: false,
      pl: { bag: 200000, clout: 50, aura: 30, maxClout: 500, maxAura: 500, mentalHealth: 100, maxMentalHealth: 100, mo: 5, tier: 1 },
      audioTracks: 10,
      audioPromo: 75,
      audioStyle: 20,
      audioUpgrades: { mixingSuite: false, analogConsole: false },
      talentScouters: 0,
      holwoodSyncActive: false,
      audioHitActive: false,
      news: [],
      flex: { penthouse: { owned: false }, logistics: { owned: false }, jet: { owned: false }, yacht: { owned: false }, media: { owned: false }, foundation: { owned: false }, art: { owned: false }, watch: { owned: false }, car: { owned: false }, archive: { owned: false } }
    },
    version: 1.1
  };

  await page.addInitScript((state) => {
    window.localStorage.setItem('bag-chaser-save-v1', JSON.stringify(state));
  }, gameState);

  await page.goto('http://localhost:5173');

  await expect(page.locator('h3:has-text("INDIE AUDIO SYNDICATE")')).toBeVisible();
  await expect(page.locator('text=Promo')).toBeVisible();
  await expect(page.locator('text=Style')).toBeVisible();

  await expect(page.locator('div.font-mono:has-text("75%")')).toBeVisible();
  await expect(page.locator('div.font-mono:has-text("20%")')).toBeVisible();

  await expect(page.locator('text=$1.8K')).toBeVisible();

  await page.click('button:has-text("REC SINGLE")');
});
