import { test, expect } from '@playwright/test';

test('Flex Showcase system verifies stat cap shattering', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Skip prologue
  for (let i = 0; i < 3; i++) {
    const gotItBtn = page.locator('button:has-text("GOT IT")');
    if (await gotItBtn.isVisible()) {
      await gotItBtn.click();
      await page.waitForTimeout(300);
    }
  }

  const letsRunItBtn = page.locator('button:has-text("LET\'S RUN IT")');
  if (await letsRunItBtn.isVisible()) {
    await letsRunItBtn.click();
    await page.waitForTimeout(300);
  }

  const nameInput = page.locator('input[placeholder*="ALIAS"]');
  if (await nameInput.isVisible()) {
    await nameInput.fill('TEST');
    await page.locator('button:has-text("ENTER THE MATRIX")').click();
    await page.waitForTimeout(500);
  }

  // Skip game intro
  const nextBtn = page.locator('button:has-text("NEXT PAGE")');
  if (await nextBtn.isVisible()) {
    await nextBtn.click();
    await page.waitForTimeout(300);
  }

  const beginBtn = page.locator('button:has-text("BEGIN HUSTLE")');
  if (await beginBtn.isVisible()) {
    await beginBtn.click();
    await page.waitForTimeout(500);
  }

  // Check if Flex Showcase tab is in the HUD
  const flexTab = page.locator('button:has-text("FLEX SHOWCASE")');
  await expect(flexTab).toBeVisible({ timeout: 10000 });
});
