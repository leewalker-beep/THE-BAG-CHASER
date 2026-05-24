import { test, expect } from '@playwright/test';

test('Capture Phase 3 Corporate Tier Screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
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
  await page.screenshot({ path: 'vintage_phase3.png' });

  await page.evaluate(() => {
     const save = JSON.parse(localStorage.getItem('bag-chaser-save-v1'));
     save.tab = 'SMM';
     localStorage.setItem('bag-chaser-save-v1', JSON.stringify(save));
     window.location.reload();
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'smm_phase3.png' });
});
