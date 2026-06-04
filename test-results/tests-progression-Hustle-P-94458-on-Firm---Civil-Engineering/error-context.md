# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/progression.spec.ts >> Hustle Progression Verification >> Deep Dive r_labor Path 3: Skilled Trade -> Construction Firm -> Civil Engineering
- Location: tests/progression.spec.ts:112:3

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator:  locator('button:has-text("CONFIRM UPGRADE")')
Expected: enabled
Received: disabled
Timeout:  10000ms

Call log:
  - Expect "toBeEnabled" with timeout 10000ms
  - waiting for locator('button:has-text("CONFIRM UPGRADE")')
    24 × locator resolved to <button disabled class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-black rounded uppercase tracking-widest transition-all">CONFIRM UPGRADE ⚡</button>
       - unexpected value "disabled"

```

```yaml
- button "CONFIRM UPGRADE ⚡" [disabled]
```

# Test source

```ts
  18  |
  19  |     // Set state for testing
  20  |     await page.evaluate(() => {
  21  |       const state = window.useGameStore.getState();
  22  |       window.useGameStore.setState({
  23  |         pl: {
  24  |           ...state.pl,
  25  |           bag: 1000000000,
  26  |           clout: 1000,
  27  |           aura: 1000,
  28  |           currentTier: 'OPEN',
  29  |           tier: 10,
  30  |           maxClout: 9999,
  31  |           maxAura: 9999
  32  |         }
  33  |       });
  34  |     });
  35  |     await page.waitForTimeout(1000);
  36  |   });
  37  |
  38  |   for (const hustleId of HUSTLES) {
  39  |     test(`Verify ${hustleId} progression and execution`, async ({ page }) => {
  40  |       const registry = await page.evaluate(() => window.MASTER_HUSTLE_REGISTRY);
  41  |       const config = registry.find(h => h.id === hustleId || (hustleId === 'tech_flip' && h.id === 'techFlip'));
  42  |       if (!config) throw new Error(`Hustle ${hustleId} not found`);
  43  |
  44  |       await page.click(`button:has-text("${config.tier}")`);
  45  |       await page.click(`button:has-text("${config.name}")`);
  46  |
  47  |       await expect(page.getByRole('button', { name: 'Operations', exact: true })).toBeVisible();
  48  |       await expect(page.getByRole('button', { name: 'Progression', exact: true })).toBeVisible();
  49  |
  50  |       await page.click('button:has-text("Progression")');
  51  |
  52  |       const nextNodeBtn = page.locator('button:has-text("BRANCH"), button:has-text("UPGRADE")').first();
  53  |       await nextNodeBtn.click();
  54  |
  55  |       const confirmBtn = page.locator('button:has-text("CONFIRM UPGRADE")');
  56  |       await expect(confirmBtn).toBeEnabled({ timeout: 15000 });
  57  |       await confirmBtn.click();
  58  |
  59  |       // Check state
  60  |       const nodeId = await page.evaluate((id) => window.useGameStore.getState().pl.hustleNodeIds[id === 'tech_flip' ? 'techFlip' : id], hustleId);
  61  |       expect(nodeId).not.toBe('l1');
  62  |
  63  |       await page.click('button:has-text("Operations")');
  64  |       const executeBtn = page.locator('button:has-text("EXECUTE"), button:has-text("START")').first();
  65  |       await executeBtn.click();
  66  |
  67  |       await expect(page.locator('footer')).toContainText(config.name, { ignoreCase: true });
  68  |     });
  69  |   }
  70  |
  71  |   test('Deep Dive r_labor Path 1: House Renovation -> House Flip -> Commercial', async ({ page }) => {
  72  |     await page.click('button:has-text("MUD")');
  73  |     await page.click('button:has-text("Manual Labor")');
  74  |     await page.click('button:has-text("Progression")');
  75  |
  76  |     await page.click('div:has-text("House Renovation") >> button:has-text("BRANCH")');
  77  |     await expect(page.locator('button:has-text("CONFIRM UPGRADE")')).toBeEnabled({ timeout: 10000 });
  78  |     await page.click('button:has-text("CONFIRM UPGRADE")');
  79  |     await page.waitForTimeout(500);
  80  |
  81  |     await page.click('div:has-text("House Flip") >> button:has-text("BRANCH")');
  82  |     await expect(page.locator('button:has-text("CONFIRM UPGRADE")')).toBeEnabled({ timeout: 10000 });
  83  |     await page.click('button:has-text("CONFIRM UPGRADE")');
  84  |     await page.waitForTimeout(500);
  85  |
  86  |     await page.click('div:has-text("Commercial Real Estate") >> button:has-text("UPGRADE")');
  87  |     await expect(page.locator('button:has-text("CONFIRM UPGRADE")')).toBeEnabled({ timeout: 10000 });
  88  |     await page.click('button:has-text("CONFIRM UPGRADE")');
  89  |
  90  |     const nodeId = await page.evaluate(() => window.useGameStore.getState().pl.hustleNodeIds['r_labor']);
  91  |     expect(nodeId).toBe('l4a');
  92  |   });
  93  |
  94  |   test('Deep Dive r_labor Path 2: House Renovation -> Rent Portfolio', async ({ page }) => {
  95  |     await page.click('button:has-text("MUD")');
  96  |     await page.click('button:has-text("Manual Labor")');
  97  |     await page.click('button:has-text("Progression")');
  98  |
  99  |     await page.click('div:has-text("House Renovation") >> button:has-text("BRANCH")');
  100 |     await expect(page.locator('button:has-text("CONFIRM UPGRADE")')).toBeEnabled({ timeout: 10000 });
  101 |     await page.click('button:has-text("CONFIRM UPGRADE")');
  102 |     await page.waitForTimeout(500);
  103 |
  104 |     await page.click('div:has-text("Rent Portfolio") >> button:has-text("BRANCH")');
  105 |     await expect(page.locator('button:has-text("CONFIRM UPGRADE")')).toBeEnabled({ timeout: 10000 });
  106 |     await page.click('button:has-text("CONFIRM UPGRADE")');
  107 |
  108 |     const nodeId = await page.evaluate(() => window.useGameStore.getState().pl.hustleNodeIds['r_labor']);
  109 |     expect(nodeId).toBe('l3b');
  110 |   });
  111 |
  112 |   test('Deep Dive r_labor Path 3: Skilled Trade -> Construction Firm -> Civil Engineering', async ({ page }) => {
  113 |     await page.click('button:has-text("MUD")');
  114 |     await page.click('button:has-text("Manual Labor")');
  115 |     await page.click('button:has-text("Progression")');
  116 |
  117 |     await page.click('div:has-text("Skilled Trade") >> button:has-text("BRANCH")');
> 118 |     await expect(page.locator('button:has-text("CONFIRM UPGRADE")')).toBeEnabled({ timeout: 10000 });
      |                                                                      ^ Error: expect(locator).toBeEnabled() failed
  119 |     await page.click('button:has-text("CONFIRM UPGRADE")');
  120 |     await page.waitForTimeout(500);
  121 |
  122 |     await page.click('div:has-text("Construction Firm") >> button:has-text("UPGRADE")');
  123 |     await expect(page.locator('button:has-text("CONFIRM UPGRADE")')).toBeEnabled({ timeout: 10000 });
  124 |     await page.click('button:has-text("CONFIRM UPGRADE")');
  125 |     await page.waitForTimeout(500);
  126 |
  127 |     await page.click('div:has-text("Civil Engineering Firm") >> button:has-text("UPGRADE")');
  128 |     await expect(page.locator('button:has-text("CONFIRM UPGRADE")')).toBeEnabled({ timeout: 10000 });
  129 |     await page.click('button:has-text("CONFIRM UPGRADE")');
  130 |
  131 |     const nodeId = await page.evaluate(() => window.useGameStore.getState().pl.hustleNodeIds['r_labor']);
  132 |     expect(nodeId).toBe('l4b');
  133 |   });
  134 | });
  135 |
```