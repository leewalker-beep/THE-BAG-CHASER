import { test, expect } from '@playwright/test';

test('verify overhaul visuals', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Go through prologue
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=LET\'S RUN IT →');
  await page.fill('input[placeholder="ALIAS (3-5 CHARS)"]', 'JULES');
  await page.click('text=ENTER THE MATRIX');

  // New GameIntro flow
  await page.waitForSelector('text=THE BRIEFING: PAGE 1', { timeout: 15000 });
  await page.click('text=NEXT PAGE →');
  await page.waitForSelector('text=THE BRIEFING: PAGE 2', { timeout: 15000 });
  await page.click('text=BEGIN HUSTLE');

  // Verify HUD
  await page.waitForSelector('text=NET WORTH', { timeout: 15000 });

  // Take screenshot of HUB first
  await page.screenshot({ path: 'overhaul_hub.png' });

  // Click Streetwear
  await page.click('button:has-text("STREETWEAR")');

  // Wait and screenshot
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'overhaul_visuals.png' });
});
