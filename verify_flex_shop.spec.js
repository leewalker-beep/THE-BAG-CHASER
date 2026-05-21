import { test, expect } from '@playwright/test';

test('verify flex shop navigation and persistence', async ({ page }) => {
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

  // Navigate to Flex Shop
  const flexShopButton = page.locator('button:has-text("ENTER THE FLEX SHOP")');
  await flexShopButton.click();

  // Verify Flex Shop content - Wait for something unique to the shop view
  await page.waitForSelector('text=SCALABLE MONEY SINKS', { timeout: 15000 });
  await page.screenshot({ path: 'flex_shop_debug.png' });

  // Check for item labels - using a more specific locator
  await expect(page.locator('text=ULTRA HIGH-END PENTHOUSE')).toBeVisible();
  await page.screenshot({ path: 'flex_shop_verified.png' });

  // Test Return to Hub
  await page.click('button:has-text("RETURN TO HUB")');
  await page.waitForSelector('button:has-text("ENTER THE FLEX SHOP")', { timeout: 15000 });

  // Test Auto-save persistence
  // Wait for 11 seconds to ensure auto-save happens
  console.log('Waiting for auto-save (11s)...');
  await page.waitForTimeout(11000);

  // Reload
  await page.reload();

  // Verify we are back in the game, not the intro
  await page.waitForSelector('text=NET WORTH', { timeout: 15000 });
  await page.screenshot({ path: 'persistence_verified.png' });
});
