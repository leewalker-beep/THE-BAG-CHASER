import { test, expect } from '@playwright/test';

test('verify visual cleanup', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Navigate through the intro screens if present
  // Based on memory and code: GOT IT -> GOT IT -> GOT IT -> LET'S RUN IT -> ALIAS/DIFFICULTY -> ENTER THE MATRIX -> NEXT PAGE -> NEXT PAGE -> BEGIN HUSTLE

  // 1. "GOT IT ->" (3 times)
  for (let i = 0; i < 3; i++) {
    const gotIt = page.getByRole('button', { name: 'GOT IT' });
    if (await gotIt.isVisible()) {
      await gotIt.click();
    }
  }

  // 2. "LET'S RUN IT ->"
  const letsRunIt = page.getByRole('button', { name: "LET'S RUN IT" });
  if (await letsRunIt.isVisible()) {
    await letsRunIt.click();
  }

  // 3. "ENTER THE MATRIX"
  const aliasInput = page.getByPlaceholder('ALIAS (3-5 CHARS)');
  if (await aliasInput.isVisible()) {
    await aliasInput.fill('TEST');
    await page.getByRole('button', { name: 'ENTER THE MATRIX' }).click();
  }

  // 4. "NEXT PAGE ->" (2 times)
  for (let i = 0; i < 2; i++) {
    const nextPage = page.getByRole('button', { name: 'NEXT PAGE' });
    if (await nextPage.isVisible()) {
      await nextPage.click();
    }
  }

  // 5. "BEGIN HUSTLE"
  const beginHustle = page.getByRole('button', { name: 'BEGIN HUSTLE' });
  if (await beginHustle.isVisible()) {
    await beginHustle.click();
  }

  // Wait for GameInterface to load
  await expect(page.locator('text=NET WORTH')).toBeVisible();

  // Check if redundant sticky header is gone (the one with Empire Liquidity)
  const empireLiquidity = page.locator('text=Empire Liquidity');
  await expect(empireLiquidity).not.toBeVisible();

  // Take screenshot
  await page.screenshot({ path: 'visual_cleanup_verified.png' });
});
