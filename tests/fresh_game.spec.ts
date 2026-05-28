import { test, expect } from '@playwright/test';

test('fresh game starts correctly without black screen', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Progress through Prologue
  await page.click('button:has-text("GOT IT →")');
  await page.click('button:has-text("GOT IT →")');
  await page.click('button:has-text("GOT IT →")');
  await page.click('button:has-text("LET\'S RUN IT →")');

  // Enter Alias and Start
  await page.fill('input[placeholder="ALIAS (3-5 CHARS)"]', 'JULES');
  await page.click('button:has-text("ENTER THE MATRIX")');

  // Progress through Briefing
  await page.click('button:has-text("NEXT PAGE →")');
  await page.click('button:has-text("BEGIN HUSTLE")');

  // Check if stats are visible (Aura)
  await expect(page.locator('text=AURA')).toBeVisible({ timeout: 10000 });

  // Check if initial stats are present
  await expect(page.locator('text=NET WORTH')).toBeVisible();
  await expect(page.locator('text=CLOUT')).toBeVisible();

  // Verify Hub is visible by checking for a hustle
  await expect(page.getByTestId('hustle-btn-SW')).toBeVisible();
});
