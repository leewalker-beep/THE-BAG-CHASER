import { test, expect } from '@playwright/test';

test('verify mogul tier components', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Skip intro
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=LET\'S RUN IT →');

  await page.fill('input[placeholder="ALIAS (3-5 CHARS)"]', 'MOGUL');
  await page.click('text=ENTER THE MATRIX');

  await page.click('text=NEXT PAGE →');
  await page.click('text=BEGIN HUSTLE');

  // Verify Hub is loaded
  await expect(page.locator('text=NET WORTH')).toBeVisible();

  // Inject state to unlock Mogul tier and have enough money
  await page.evaluate(() => {
    const context = window.__GAME_CONTEXT__; // This assumes we exposed it, which we might not have.
    // Alternative: Use localStorage if the game loads from it
    const saveKey = 'bag-chaser-save-v1';
    const state = JSON.parse(localStorage.getItem(saveKey) || '{}');
    state.pl = { ...state.pl, tier: 4, bag: 1000000000, clout: 2000, aura: 1000 };
    state.ph = 'PLAYING';
    localStorage.setItem(saveKey, JSON.stringify(state));
    window.location.reload();
  });

  // Wait for reload
  await page.waitForTimeout(2000);

  // Navigate to Mogul tier
  await page.click('text=MOGUL');

  // Verify Conglomerate and Sovereign buttons in Hub
  await expect(page.locator('text=GLOBAL CONGLOMERATE')).toBeVisible();
  await expect(page.locator('text=SOVEREIGN WEALTH FUND')).toBeVisible();

  // Test Conglomerate Tab
  await page.click('text=GLOBAL CONGLOMERATE');
  await expect(page.locator('text=CONGLOMERATE STATUS')).toBeVisible();
  await expect(page.locator('text=FORM GLOBAL CONGLOMERATE ($250M)')).toBeVisible();

  // Return to Hub
  await page.click('text=🏠 EMPIRE HUB');

  // Test Sovereign Tab
  await page.click('text=SOVEREIGN WEALTH FUND');
  await expect(page.locator('text=INVESTED CAPITAL')).toBeVisible();
  await expect(page.locator('text=PARK $100M IN FOREIGN ASSETS')).toBeVisible();

  await page.screenshot({ path: 'mogul_tier_verified.png' });
});
