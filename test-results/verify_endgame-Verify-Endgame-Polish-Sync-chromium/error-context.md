# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: verify_endgame.spec.js >> Verify Endgame Polish & Sync
- Location: verify_endgame.spec.js:3:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('body')
Timeout: 5000ms
- Expected substring  - 1
+ Received string     + 6

- LOCKED
+
+
+
+
+
+

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('body')
    14 × locator resolved to <body class="bg-black text-white selection:bg-green-500 selection:text-black">…</body>
       - unexpected value "




"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('Verify Endgame Polish & Sync', async ({ page }) => {
  4  |   await page.goto('http://localhost:5173');
  5  |
  6  |   // Set up a Mogul state with lots of cash
  7  |   await page.evaluate(() => {
  8  |     const state = {
  9  |       ph: 'PLAYING',
  10 |       alias: 'Jules',
  11 |       pl: { bag: 1000000000, aura: 100, clout: 20, mo: 0, tier: 4, mentalHealth: 100, maxMentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 },
  12 |       tab: 'HUB',
  13 |       peaks: { peakB: 1000000000, peakA: 100, peakC: 20 },
  14 |       flex: {
  15 |         penthouse: { owned: false, expiresAt: 0 },
  16 |         yacht: { owned: false, expiresAt: 0 },
  17 |         logistics: { owned: false, expiresAt: 0 },
  18 |         jet: { owned: false, expiresAt: 0 },
  19 |         hypercar: { owned: false, prActive: false },
  20 |         art: { owned: false, prActive: false },
  21 |         watchVault: { owned: false, prActive: false },
  22 |         media: { owned: false, expiresAt: 0 },
  23 |         foundation: { owned: false, prActive: false },
  24 |         sportsTeam: { owned: false, prActive: false },
  25 |         island: { owned: false, prActive: false },
  26 |         archive: { owned: false, prActive: false }
  27 |       }
  28 |     };
  29 |     localStorage.setItem('bag-chaser-save-v1', JSON.stringify(state));
  30 |     window.location.reload();
  31 |   });
  32 |
  33 |   await page.waitForTimeout(2000);
  34 |
  35 |   // Check Syndicate is locked (visual check via screenshot)
  36 |   const mogulBtn = page.locator('button').filter({ hasText: 'MOGUL' });
  37 |   await mogulBtn.click();
  38 |
  39 |   // The tab is likely rendered as a button in TierHub
  40 |   const syndicateBtn = page.locator('button').filter({ hasText: 'KINGMAKER SYNDICATE' });
  41 |   await syndicateBtn.click();
  42 |
  43 |   await page.waitForTimeout(500);
  44 |   await page.screenshot({ path: '/home/jules/verification/syndicate_locked.png' });
  45 |
  46 |   // Verify it says LOCKED or similar
> 47 |   await expect(page.locator('body')).toContainText('LOCKED');
     |                                      ^ Error: expect(locator).toContainText(expected) failed
  48 |
  49 |   // Buy Mega-Yacht
  50 |   await page.locator('button').filter({ hasText: 'THE SHOWCASE' }).click();
  51 |   await page.waitForTimeout(500);
  52 |
  53 |   await page.evaluate(() => {
  54 |     const yachtSection = Array.from(document.querySelectorAll('div')).find(el => el.innerText.includes('400-Foot Mega-Yacht'));
  55 |     const buyButton = yachtSection.querySelector('button');
  56 |     buyButton.click();
  57 |   });
  58 |   await page.waitForTimeout(500);
  59 |
  60 |   // Check Syndicate is unlocked
  61 |   await page.locator('button').filter({ hasText: 'RETURN TO OPERATIONS' }).click();
  62 |   await mogulBtn.click();
  63 |   await syndicateBtn.click();
  64 |   await page.waitForTimeout(1000);
  65 |   await page.screenshot({ path: '/home/jules/verification/syndicate_unlocked.png' });
  66 |
  67 |   // Verify Stat Un-clamping
  68 |   await page.locator('button').filter({ hasText: 'HUB' }).click();
  69 |   await page.locator('button').filter({ hasText: 'THE SHOWCASE' }).click();
  70 |   await page.evaluate(() => {
  71 |     const penthouseSection = Array.from(document.querySelectorAll('div')).find(el => el.innerText.includes('Skyline Penthouse HQ'));
  72 |     const buyButton = penthouseSection.querySelector('button');
  73 |     buyButton.click();
  74 |   });
  75 |   await page.waitForTimeout(500);
  76 |
  77 |   const maxClout = await page.evaluate(() => {
  78 |     const save = JSON.parse(localStorage.getItem('bag-chaser-save-v1'));
  79 |     return save.pl.maxClout;
  80 |   });
  81 |
  82 |   console.log('Final Max Clout:', maxClout);
  83 |   expect(maxClout).toBe(1500);
  84 | });
  85 |
```