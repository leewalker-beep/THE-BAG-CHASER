from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_boot(page: Page):
    page.goto("http://localhost:5173")
    expect(page.get_by_text("THE BAG CHASER")).to_be_visible()

    # 3. Act: Progress to Game
    page.click('text=GOT IT →')
    time.sleep(0.5)
    page.click('text=GOT IT →')
    time.sleep(0.5)
    page.click('text=GOT IT →')
    time.sleep(0.5)
    page.click("text=LET'S RUN IT →")
    time.sleep(0.5)

    # Enter alias and start
    page.fill('input[placeholder="ALIAS (3-5 CHARS)"]', "VRIFY")
    time.sleep(0.5)
    page.click('text=ENTER THE MATRIX')

    # Wait for Prologue Intro (GameIntro)
    page.wait_for_selector('text=THE BRIEFING: PAGE 1', timeout=5000)
    page.screenshot(path="/home/jules/verification/game_intro.png")

    page.click('text=NEXT PAGE →')
    time.sleep(0.5)
    page.click('text=BEGIN HUSTLE')

    # Now it should be in PLAYING phase
    page.wait_for_selector('text=NET WORTH', timeout=5000)
    page.screenshot(path="/home/jules/verification/boot_game_interface.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_boot(page)
        finally:
            browser.close()
