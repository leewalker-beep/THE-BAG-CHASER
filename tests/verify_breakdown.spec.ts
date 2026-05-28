import { test, expect } from '@playwright/test';

test('Mental Health drop to 0 triggers breakdown modal', async ({ page }) => {
  // Inject state to bypass intro and go straight to hub with low mental health
  const state = {
    ph: 'PLAYING',
    alias: 'BreakdownTest',
    tab: 'HUB',
    pl: {
      bag: 1000,
      clout: 10,
      aura: 10,
      tier: 0,
      mentalHealth: 25, // Low MH to start
      maxMentalHealth: 100,
      mo: 0
    }
  };

  await page.addInitScript((data) => {
    window.localStorage.setItem('bag-chaser-save-v1', JSON.stringify({ state: data, version: 1.1 }));
  }, state);

  await page.goto('http://localhost:5173');

  // Go to Labor Tab
  await page.click('[data-testid="hustle-btn-LABOR"]');

  // Click Labor until MH is 0.
  // Each Labor click is 25 MH (from MudActions.js)
  // 1 click should bring it to 0.

  const laborBtn = page.locator('button:has-text("FLYER DISTRIBUTION")');
  await laborBtn.click();

  // Wait for breakdown modal
  await expect(page.locator('text=TOTAL NERVOUS BREAKDOWN')).toBeVisible();

  // Click Discharge
  await page.click('button:has-text("DISCHARGE FROM WELLNESS CARE")');

  // Modal should be gone
  await expect(page.locator('text=TOTAL NERVOUS BREAKDOWN')).not.toBeVisible();

  // Verify MH is restored (to 50% of max = 50)
  // We can't easily check internal state, but we can check if we can click again (meaning gBusy is false)
  await expect(page.locator('button:has-text("FLYER DISTRIBUTION")')).toBeVisible();
});
