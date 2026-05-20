import { test, expect } from '@playwright/test';

test('verify vintage and smm hustles', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Go through prologue
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=LET\'S RUN IT →');
  await page.fill('input[placeholder="ALIAS (3-5 CHARS)"]', 'JULES');
  await page.click('text=ENTER THE MATRIX');

  // Verify HUD Stamina
  await expect(page.locator('text=STAMINA')).toBeVisible();

  // Verify Vintage Reselling
  await expect(page.locator('text=VINTAGE RESELLING')).toBeVisible();
  await page.click('text=VINTAGE RESELLING');
  await expect(page.locator('text=HIT THE CLOTHING BINS')).toBeVisible();
  await page.screenshot({ path: 'vintage_tab.png' });
  await page.click('text=EMPIRE HUB');

  // Verify SMM Micro-Agency
  await expect(page.locator('text=SMM MICRO-AGENCY')).toBeVisible();
  await page.click('text=SMM MICRO-AGENCY');
  await expect(page.locator('text=PITCH LOCAL BUSINESS')).toBeVisible();
  await page.screenshot({ path: 'smm_tab.png' });
});
