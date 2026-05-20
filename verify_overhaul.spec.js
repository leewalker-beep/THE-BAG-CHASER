import { test, expect } from '@playwright/test';

test('verify overhaul tabs', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Go through prologue
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=LET\'S RUN IT →');
  await page.fill('input[placeholder="ALIAS (3-5 CHARS)"]', 'JULES');
  await page.click('text=ENTER THE MATRIX');

  // Verify HUD
  await expect(page.locator('text=NET WORTH — JULES')).toBeVisible();

  // Switch to FLEXES
  await page.click('text=FLEXES');
  await expect(page.locator('text=LIFESTYLE FLEXES')).toBeVisible();
  await expect(page.locator('text=Patek Philippe Watch')).toBeVisible();
  await page.screenshot({ path: 'flexes_view.png' });

  // Switch to EXP POINTS
  await page.click('text=EXP POINTS');
  await expect(page.locator('text=EXP & METRICS')).toBeVisible();
  await expect(page.locator('text=GLOBAL LEVEL')).toBeVisible();
  await page.screenshot({ path: 'exp_view.png' });

  // Switch to STREET (Locked)
  await page.click('text=🔒 STREET');
  await expect(page.locator('text=CREATOR LAB')).toBeVisible();
  await page.screenshot({ path: 'locked_street.png' });

  // Return to HUB
  await page.click('text=RETURN TO HUB');
  await expect(page.locator('text=STREETWEAR')).toBeVisible();
});
