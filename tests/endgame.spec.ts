import { test, expect } from '@playwright/test';

test('endgame flow verification', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.evaluate(() => {
    localStorage.setItem('bag-chaser-save-v1', JSON.stringify({
      version: "1.1",
      ph: 'PLAYING',
      tab: 'VICTORY_SPEECH',
      isPresident: true,
      alias: 'JULES_TEST',
      pl: { bag: 1000000000, clout: 5000, aura: 2500, mo: 120, tier: 5, maxMentalHealth: 100, mentalHealth: 100, maxClout: 5000, maxAura: 2500 },
      campaign: { phase: 'COMPLETED' },
      flex: {
        penthouse: { owned: false }, logistics: { owned: false }, jet: { owned: false },
        watch: { owned: false }, car: { owned: false }, art: { owned: false },
        yacht: { owned: false }, media: { owned: false }, foundation: { owned: false },
        spt: { owned: false }, island: { owned: false }, archive: { owned: false }
      }
    }));
    window.location.reload();
  });

  await expect(page.locator('text=Inaugural Address')).toBeVisible();

  await page.click('button:has-text("WE LOCKED IN.")');
  await page.click('button:has-text("NO HANDOUTS.")');
  await page.click('button:has-text("GLAZING IS OVER.")');

  const modalHeader = page.locator('h2:has-text("THE ULTIMATE FLEX")');
  await expect(modalHeader).toBeVisible();
  await page.screenshot({ path: 'tests/victory_modal.png' });

  // Test Continue - try to click by position if needed, or just force
  await page.click('button:has-text("CONTINUE CAMPAIGN RUN")', { force: true });

  // Wait a bit for state transition
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tests/after_continue.png' });

  const isModalVisible = await modalHeader.isVisible();
  if (isModalVisible) {
    console.log("Modal still visible after click!");
  }

  // Reload to test submit
  await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('bag-chaser-save-v1') || '{}');
    d.tab = 'VICTORY_SPEECH';
    localStorage.setItem('bag-chaser-save-v1', JSON.stringify(d));
    window.location.reload();
  });

  await page.click('button:has-text("WE LOCKED IN.")');
  await page.click('button:has-text("NO HANDOUTS.")');
  await page.click('button:has-text("GLAZING IS OVER.")');

  // Accept prompt
  page.on('dialog', async dialog => {
    await dialog.accept('JULES_LEGEND');
  });

  await page.click('button:has-text("SUBMIT TO HALL OF FAME & RESET")', { force: true });

  await expect(page.locator('text=Run Performance Matrix')).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: 'tests/post_mortem.png' });

  await page.click('button:has-text("View Global Standings")');
  await expect(page.locator('text=Hall of Fame')).toBeVisible();
  await expect(page.locator('text=JULES_LEGEND')).toBeVisible();
  await page.screenshot({ path: 'tests/leaderboard.png' });
});
