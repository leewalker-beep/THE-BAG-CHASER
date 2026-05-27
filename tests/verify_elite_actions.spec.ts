import { test, expect } from '@playwright/test';

test('verify elite actions (PE and Art)', async ({ page }) => {
  // Inject state to bypass intro and unlock Elite tier
  await page.addInitScript(() => {
    const state = {
      ph: 'PLAYING',
      selTier: '3',
      tab: 'HUB',
      pl: {
        bag: 100000000,
        clout: 1000,
        aura: 500,
        tier: 3,
        mentalHealth: 100,
        maxMentalHealth: 100,
        heat: 0,
        maxClout: 1500,
        maxAura: 600,
        mo: 20
      },
      peProgress: 0,
      guttedFirms: 0,
      artCollection: [],
      venueState: 'THE VAULT',
      hustleFatigue: { SW: 0, DROP: 0, TECH_FLIP: 0, VINTAGE: 0, SMM: 0, GIG: 0, DELIVERY: 0, PLASMA: 0, SURVEY: 0, LABOR: 0, CC: 0, POD: 0, BOX: 0, AUDIO: 0, TECH: 0, AI_AGENCY: 0, CRE_FLIP: 0, FRANCHISE: 0, CRYP: 0, TOUR: 0, PE_ROLLUP: 0, ART_SPEC: 0, HF: 0, CONGLOMERATE: 0, PMC: 0, SOVEREIGN: 0, MOV: 0, SYNDICATE: 0, PAC: 0, BLITZ: 0, SMEAR: 0, ELECTION: 0 },
      flex: { penthouse: { owned: false, expiresAt: 0, prActive: false }, logistics: { owned: false, expiresAt: 0, prActive: false }, jet: { owned: false, expiresAt: 0, prActive: false }, yacht: { owned: false, expiresAt: 0, prActive: false }, media: { owned: false, prActive: false }, foundation: { owned: false }, art: { owned: false, prActive: false }, watch: { owned: false, prActive: false }, car: { owned: false }, archive: { owned: false } },
      peaks: { bag: 100000000, clout: 1000, aura: 500 },
      news: [],
      imp: [],
      mod: { s: false, t: '', m: '', o: [], ui: 'ui-modal' }
    };
    window.localStorage.setItem('bag-chaser-save-v1', JSON.stringify({ state, version: 1.1 }));
  });

  await page.goto('http://localhost:5173');

  // Verify PE action
  await page.click('[data-testid="hustle-btn-PE_ROLLUP"]');
  await expect(page.locator('text=Buyout Progress')).toBeVisible();
  await page.click('button:has-text("EXECUTE LEVERAGED BUYOUT")');

  // Wait for FlashBtn animation (it goes through 'calc' then 'win' or 'idle')
  await page.waitForTimeout(3000);

  // Progress should be 20%
  await expect(page.locator('text=20%')).toBeVisible();

  // Verify Art action
  await page.click('button:has-text("EMPIRE HUB")');
  await page.click('[data-testid="hustle-btn-ART_SPEC"]');
  await expect(page.locator('text=ART HUSTLE')).toBeVisible();

  await page.click('button:has-text("PURCHASE ART Piece")');
  await page.waitForTimeout(3000);

  // Verify collection count incremented
  // There's a div with text "Pieces" and its sibling/parent has the count
  await expect(page.locator('text=1').first()).toBeVisible();

  await page.screenshot({ path: 'verification/elite_actions.png' });
});
