
import { test, expect } from '@playwright/test';

test('verify integrated risk terminal', async ({ page }) => {
  await page.addInitScript(() => {
    const state = {
      ph: 'PLAYING',
      tab: 'SW',
      selTier: '0',
      up: { swIp: true, swFlg: true, swPar: true },
      pl: { bag: 1000000, aura: 500, clout: 200, mentalHealth: 100, maxMentalHealth: 100, tier: 1 },
      sw: { i: 1, u: 100, p: 50, a: 0 },
      pfwActive: true,
      version: "1.1"
    };
    localStorage.setItem('bag-chaser-save-v1', JSON.stringify(state));
  });

  await page.goto('http://localhost:5173');

  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/jules/verification/debug_integrated.png' });
});
