import { test, expect } from '@playwright/test';

test('verify persistence across reloads', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Progress to alias entry
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click('text=GOT IT →');
  await page.click("text=LET'S RUN IT →");

  // Enter alias and start
  const testAlias = 'PERST';
  await page.fill('input[placeholder="ALIAS (3-5 CHARS)"]', testAlias);
  await page.click('text=ENTER THE MATRIX');

  // Wait for briefing
  await expect(page.getByText('THE BRIEFING: PAGE 1')).toBeVisible();

  // Reload page
  await page.reload();

  // Verify it's still on briefing (which means state was preserved)
  // If state was lost, it would be back at the intro screen.
  await expect(page.getByText('THE BRIEFING: PAGE 1')).toBeVisible();

  // Check if alias is preserved in store via window if possible,
  // or just trust the current view.
  // Let's actually finish the briefing to see the main UI and alias.
  await page.click('text=NEXT PAGE →');
  await page.click('text=BEGIN HUSTLE');

  await expect(page.getByText('NET WORTH')).toBeVisible();
  await expect(page.getByText(testAlias)).toBeVisible();

  // Final reload
  await page.reload();
  await expect(page.getByText('NET WORTH')).toBeVisible();
  await expect(page.getByText(testAlias)).toBeVisible();
});
