# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/endgame.spec.ts >> endgame flow verification
- Location: tests/endgame.spec.ts:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Run Performance Matrix')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=Run Performance Matrix')

```

```yaml
- heading "THE ULTIMATE FLEX" [level=2]
- paragraph: "\"You have conquered the highest office in the land. The bag is secured, and the board is yours. How do you wish to proceed?\""
- button "CONTINUE CAMPAIGN RUN"
- button "SUBMIT TO HALL OF FAME & RESET"
- text: 🦅
- heading "The President of the United States" [level=2]
- 'button "EXECUTIVE ORDER: OVAL OFFICE"'
- text: NET WORTH — JULES_TEST
- button "Wipe Save"
- text: $1.0B 🧢🎒 AURA 2500/999999999 CLOUT 5000/999999999 MENTAL HEALTH 100/1000 AGE 28 MO 1 NORMAL
- button "MUD"
- button "STREET"
- button "CORPORATE"
- button "CORP FLEXES"
- button "ELITE"
- button "MOGUL"
- button "SOV FLEXES"
- button "PRESIDENT"
- text: "|"
- button "EXP POINTS"
- text: 🇺🇸
- heading "Inaugural Address" [level=1]
- paragraph: "\"As your President, I promise to deregulate the markets and ensure the grind never stops.\""
- button "GLAZING IS OVER."
- button "STAY BLESSED."
- text: 📡 REAL WORLD MONITOR NORMAL
- paragraph: Economy steady.
- text: "MARKET WATCH: Global conditions stable. Continue the grind.Booting life simulation... System optimal.Market Cycle initialized: NORMAL economy./// END FEED ///"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('endgame flow verification', async ({ page }) => {
  4  |   await page.goto('http://localhost:5173');
  5  |
  6  |   await page.evaluate(() => {
  7  |     localStorage.setItem('bag-chaser-save-v1', JSON.stringify({
  8  |       version: "1.1",
  9  |       ph: 'PLAYING',
  10 |       tab: 'VICTORY_SPEECH',
  11 |       isPresident: true,
  12 |       alias: 'JULES_TEST',
  13 |       pl: { bag: 1000000000, clout: 5000, aura: 2500, mo: 120, tier: 5, maxMentalHealth: 100, mentalHealth: 100, maxClout: 5000, maxAura: 2500 },
  14 |       campaign: { phase: 'COMPLETED' },
  15 |       flex: {
  16 |         penthouse: { owned: false }, logistics: { owned: false }, jet: { owned: false },
  17 |         watch: { owned: false }, car: { owned: false }, art: { owned: false },
  18 |         yacht: { owned: false }, media: { owned: false }, foundation: { owned: false },
  19 |         spt: { owned: false }, island: { owned: false }, archive: { owned: false }
  20 |       }
  21 |     }));
  22 |     window.location.reload();
  23 |   });
  24 |
  25 |   await expect(page.locator('text=Inaugural Address')).toBeVisible();
  26 |
  27 |   await page.click('button:has-text("WE LOCKED IN.")');
  28 |   await page.click('button:has-text("NO HANDOUTS.")');
  29 |   await page.click('button:has-text("GLAZING IS OVER.")');
  30 |
  31 |   const modalHeader = page.locator('h2:has-text("THE ULTIMATE FLEX")');
  32 |   await expect(modalHeader).toBeVisible();
  33 |   await page.screenshot({ path: 'tests/victory_modal.png' });
  34 |
  35 |   // Test Continue - try to click by position if needed, or just force
  36 |   await page.click('button:has-text("CONTINUE CAMPAIGN RUN")', { force: true });
  37 |
  38 |   // Wait a bit for state transition
  39 |   await page.waitForTimeout(1000);
  40 |   await page.screenshot({ path: 'tests/after_continue.png' });
  41 |
  42 |   const isModalVisible = await modalHeader.isVisible();
  43 |   if (isModalVisible) {
  44 |     console.log("Modal still visible after click!");
  45 |   }
  46 |
  47 |   // Reload to test submit
  48 |   await page.evaluate(() => {
  49 |     const d = JSON.parse(localStorage.getItem('bag-chaser-save-v1') || '{}');
  50 |     d.tab = 'VICTORY_SPEECH';
  51 |     localStorage.setItem('bag-chaser-save-v1', JSON.stringify(d));
  52 |     window.location.reload();
  53 |   });
  54 |
  55 |   await page.click('button:has-text("WE LOCKED IN.")');
  56 |   await page.click('button:has-text("NO HANDOUTS.")');
  57 |   await page.click('button:has-text("GLAZING IS OVER.")');
  58 |
  59 |   // Accept prompt
  60 |   page.on('dialog', async dialog => {
  61 |     await dialog.accept('JULES_LEGEND');
  62 |   });
  63 |
  64 |   await page.click('button:has-text("SUBMIT TO HALL OF FAME & RESET")', { force: true });
  65 |
> 66 |   await expect(page.locator('text=Run Performance Matrix')).toBeVisible({ timeout: 10000 });
     |                                                             ^ Error: expect(locator).toBeVisible() failed
  67 |   await page.screenshot({ path: 'tests/post_mortem.png' });
  68 |
  69 |   await page.click('button:has-text("View Global Standings")');
  70 |   await expect(page.locator('text=Hall of Fame')).toBeVisible();
  71 |   await expect(page.locator('text=JULES_LEGEND')).toBeVisible();
  72 |   await page.screenshot({ path: 'tests/leaderboard.png' });
  73 | });
  74 |
```