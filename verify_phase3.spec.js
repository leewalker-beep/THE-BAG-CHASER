import { test, expect } from '@playwright/test';

test('Verify Phase 3 Corporate Tier updates', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.evaluate(() => {
    const state = {
      ph: 'PLAYING',
      alias: 'Jules',
      pl: { bag: 10000000, aura: 500, clout: 500, mo: 24, tier: 2, mentalHealth: 100, maxMentalHealth: 100, heat: 0, maxClout: 500, maxAura: 500 },
      collectiblePhase: 'CONSIGNMENT',
      smmRetainerActive: true,
      aiSmmFactory: true,
      tab: 'VINTAGE',
      selTier: '2'
    };
    localStorage.setItem('bag-chaser-save-v1', JSON.stringify(state));
    window.location.reload();
  });

  await page.waitForTimeout(2000);

  // Check Vintage Tab - Phase 3
  await expect(page.locator('text=GLOBAL CONSIGNMENT DASHBOARD')).toBeVisible();
  await expect(page.locator('text=Platform Transaction Volume')).toBeVisible();
  await expect(page.locator('text=Global Clout Fee Multiplier')).toBeVisible();

  // Manual check for SMM Tab
  await page.evaluate(() => {
     const save = JSON.parse(localStorage.getItem('bag-chaser-save-v1'));
     save.tab = 'SMM';
     localStorage.setItem('bag-chaser-save-v1', JSON.stringify(save));
     window.location.reload();
  });
  await page.waitForTimeout(2000);

  await expect(page.locator('text=AI CONTENT FACTORY')).toBeVisible();
  await expect(page.locator('text=AI Bot Schedulers: ACTIVE')).toBeVisible();
  // Changed to check for the text without the dollar sign formatting issue in locator if any
  await expect(page.locator('text=1,000/tick')).toBeVisible();
});
