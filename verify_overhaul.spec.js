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

  // New GameIntro flow
  await expect(page.locator('text=THE BRIEFING: PAGE 1')).toBeVisible();
  await page.click('text=NEXT PAGE →');
  await expect(page.locator('text=THE BRIEFING: PAGE 2')).toBeVisible();
  await page.click('text=BEGIN HUSTLE');

  // Verify HUD
  await expect(page.locator('text=NET WORTH — JULES')).toBeVisible();
  await expect(page.locator('text=MENTAL HEALTH')).toBeVisible();

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

  // Let's verify MUD hustles first
  await page.click('text=MUD');
  await expect(page.locator('text=STREETWEAR')).toBeVisible();
  await page.click('text=STREETWEAR');
  await expect(page.locator('text=STREETWEAR LAB')).toBeVisible();
  await expect(page.locator('text=15 MENTAL HEALTH')).toBeVisible();
  await page.screenshot({ path: 'mud_hustle.png' });

  // Return to HUB
  await page.click('text=🏠 EMPIRE HUB');

  // Switch to STREET (Locked)
  await page.click('text=🔒 STREET');
  await expect(page.locator('text=LOCKED SECTOR').first()).toBeVisible();
  await page.screenshot({ path: 'locked_street_hub.png' });

});
