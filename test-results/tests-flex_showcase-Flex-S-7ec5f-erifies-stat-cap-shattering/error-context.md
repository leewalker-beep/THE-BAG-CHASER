# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/flex_showcase.spec.ts >> Flex Showcase system verifies stat cap shattering
- Location: tests/flex_showcase.spec.ts:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button:has-text("CORP FLEXES")')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('button:has-text("CORP FLEXES")')

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('Flex Showcase system verifies stat cap shattering', async ({ page }) => {
  4  |   await page.goto('http://localhost:5173');
  5  |
  6  |   // Skip prologue
  7  |   for (let i = 0; i < 3; i++) {
  8  |     const gotItBtn = page.locator('button:has-text("GOT IT")');
  9  |     if (await gotItBtn.isVisible()) {
  10 |       await gotItBtn.click();
  11 |       await page.waitForTimeout(300);
  12 |     }
  13 |   }
  14 |
  15 |   const letsRunItBtn = page.locator('button:has-text("LET\'S RUN IT")');
  16 |   if (await letsRunItBtn.isVisible()) {
  17 |     await letsRunItBtn.click();
  18 |     await page.waitForTimeout(300);
  19 |   }
  20 |
  21 |   const nameInput = page.locator('input[placeholder*="ALIAS"]');
  22 |   if (await nameInput.isVisible()) {
  23 |     await nameInput.fill('TEST');
  24 |     await page.locator('button:has-text("ENTER THE MATRIX")').click();
  25 |     await page.waitForTimeout(500);
  26 |   }
  27 |
  28 |   // Skip game intro
  29 |   const nextBtn = page.locator('button:has-text("NEXT PAGE")');
  30 |   if (await nextBtn.isVisible()) {
  31 |     await nextBtn.click();
  32 |     await page.waitForTimeout(300);
  33 |   }
  34 |
  35 |   const beginBtn = page.locator('button:has-text("BEGIN HUSTLE")');
  36 |   if (await beginBtn.isVisible()) {
  37 |     await beginBtn.click();
  38 |     await page.waitForTimeout(500);
  39 |   }
  40 |
  41 |   // Check if consolidated Flex tabs are in the HUD
  42 |   const corpFlexTab = page.locator('button:has-text("CORP FLEXES")');
> 43 |   await expect(corpFlexTab).toBeVisible({ timeout: 10000 });
     |                             ^ Error: expect(locator).toBeVisible() failed
  44 |
  45 |   const sovFlexTab = page.locator('button:has-text("SOV FLEXES")');
  46 |   await expect(sovFlexTab).toBeVisible({ timeout: 10000 });
  47 | });
  48 |
```