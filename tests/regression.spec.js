import { test, expect } from '@playwright/test';

test('state reset and navigation verification', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Verify initial state (Prologue)
  await expect(page.locator('h1')).toContainText('THE BAG CHASER');

  // Navigate through prologue
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=LET\'S RUN IT →');

  // Enter alias and start
  await page.fill('input[placeholder="ALIAS (3-5 CHARS)"]', 'TEST');
  await page.click('text=ENTER THE MATRIX');

  // Briefing
  await page.click('text=NEXT PAGE →');
  await page.click('text=BEGIN HUSTLE');

  // Verify HUD and Hub
  await expect(page.locator('text=NET WORTH — TEST')).toBeVisible();

  // Click Wipe Save
  await page.click('text=Wipe Save');

  // Verify redirected to Prologue
  await page.waitForTimeout(2000);
  await expect(page.locator('h1')).toContainText('THE BAG CHASER');
});

test('tab navigation verification', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Skip to Hub
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=LET\'S RUN IT →');
  await page.fill('input[placeholder="ALIAS (3-5 CHARS)"]', 'TEST');
  await page.click('text=ENTER THE MATRIX');
  await page.click('text=NEXT PAGE →');
  await page.click('text=BEGIN HUSTLE');

  // Check Streetwear Tab
  await page.click('text=STREETWEAR');
  await expect(page.locator('text=STREETWEAR LAB')).toBeVisible();
  await page.click('text=🏠 EMPIRE HUB');

  // Check Flex Shop
  await page.click('text=FLEX SHOP');
  await expect(page.locator('text=THE FLEX SHOP')).toBeVisible();
  await page.click('text=RETURN TO HUB');

  // Check Locked Tier
  // The tab bar buttons are like "MUD", "🔒 STREET", etc.
  await page.click('text=🔒 STREET');
  await page.click('text=CREATOR LAB');
  await expect(page.locator('text=STREET LOCKED')).toBeVisible();
});
